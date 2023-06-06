'use strict';

//---------------------------------------------------------------------------
// getPluginStore
//    Helper function that returns the database store (table) in which we
// keep plugin settings and other, related data.
//---------------------------------------------------------------------------

function getPluginStore() {
  return strapi.store({
    environment: '',
    type: 'plugin',
    name: 'youtube-feed-settings',
  });
}

//---------------------------------------------------------------------------
// getSettings
//    Returns the YouTube 'app' settings, with an empty default if not yet
// set.
//---------------------------------------------------------------------------

async function getSettings() {
  const store = getPluginStore();
  let settings = await store.get({key: 'settings'});
  if (! settings)
    settings = {
      channelName: '',
      channelId:   '',
      referer:     '',
    };
  const config = strapi.config.get('plugin.youtube-feed');
  settings.appId = config.appName;
  settings.appKey = config.appKey;
  return settings;
}

//---------------------------------------------------------------------------
// saveSettings
//    Updates the Facebook 'app' saved settings.
//---------------------------------------------------------------------------

async function saveSettings(settings) {
  try {
    // Sanitize fields.
    for (const key in settings) {
      if (! ['channelName', 'channelId', 'referer'].includes(key))
        delete settings[key];
    }
    // Then write to the database.
    const store = getPluginStore();
    await store.set({key: 'settings', value: settings});
    // Return the sanitized data.
    return settings;
  }
  catch (err) {
    return {error: err.message};
  }
}

//---------------------------------------------------------------------------
// fetchPosts
//    This function is called both via an admin UI request, and as a 'cron'
// job (see plugin/server/bootstrap.js) for periodic execution.
//---------------------------------------------------------------------------

async function fetchPosts() {
  // First get the app key. If we don't have one yet, return an error.
  const store = getPluginStore();
  const settings = await store.get({key: 'settings'});
  const app = strapi.config.get('plugin.youtube-feed');

  if (! app.appKey || ! settings.channelId)
    return { error: 'Not set up' };

  let fetched = await getYoutubePosts(app, settings);

  return { fetched }
}

//---------------------------------------------------------------------------
// getYoutubePosts
//    Fetches any new Youtube posts on the connected page. Stops when any
// post returned by Facebook has already been fetched and stored (assuming
// that FB returns posts with the default sort order of newest first).
//---------------------------------------------------------------------------

async function getYoutubePosts(app, settings) {
  // Fetch a list of all posts we've added so far: just the post ID will
  // do. We'll use this to avoid creating a new entry for these, and to
  // stop fetching.
  const saved = await strapi.entityService.findMany(
    'plugin::youtube-feed.youtube-video',
    {
      fields: ['mediaId'],
      sort: { published: 'desc' }
    });

  // Now start fetching posts from the connected Youtube channel (default
  // order is newest first).
  let fetched = 0;

  let next = `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet` +
    `&key=${app.appKey}` +
    `&channelId=${settings.channelId}` +
    `&order=date`;

  let pageToken = '';

  let options = {
    headers: {
      'Referer': settings.referer,
      'Accept':  'application/json'
    }
  }

  // Fetch and process each page of results.
  while (next) {
    const response = await fetch(next + pageToken, options)
      .then(rsp => rsp.json());
    if (response.error) {
      console.log('Youtube rejected request:', response.error);
      break;
    }

    // Within a page, we loop through the array of post data.
    for (const post of response.items) {
      // If this isn't a video post then ignore it.
      if (post.id.kind !== "youtube#video") continue;

      // If we find an entry we have already stored, we stop processing
      // (and fetching) any more.
      if (saved.some(p => p.mediaId === post.id.videoId)) {
        next = null;
        break;
      }

      // Otherwise, we create a new 'youtube-video' entry from the post
      // data.
      await strapi.entityService.create(
        'plugin::youtube-feed.youtube-video',
        {
          data: {
            mediaId:  post.id.videoId,
            title:    post.snippet.title || 'No title',
            body:     post.snippet.description || '',
            preview:  post.snippet.thumbnails.high.url,
            previewSize:
              post.snippet.thumbnails.high.width + 'x' +
              post.snippet.thumbnails.high.height,
            permalink: `https://www.youtube.com/watch?v=${post.id.videoId}`,
            published: post.snippet.publishedAt
          }
        }
      );

      fetched++;
    }

    if (response.nextPageToken)
      pageToken = `&pageToken=${response.nextPageToken}`;
    else
      break;
  }

  return fetched
}

//---------------------------------------------------------------------------
// Module exports
//---------------------------------------------------------------------------

module.exports = () => ({
  getSettings,
  saveSettings,
  fetchPosts
});
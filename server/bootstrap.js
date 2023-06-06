'use strict';

module.exports = ({ strapi }) => {
  // bootstrap phase
  const config = strapi.config.get('plugin.youtube-feed', {});
  // If periodic fetch of new posts is required, schedule a NodeJS 'cron'
  // task to do that.
  if (config.cronTable)
    strapi.cron.add({
      'youtube-fetch-items': {
        task: ({strapi}) => {
          strapi.plugin('youtube-feed')
            .service('tasks')
            .fetchPosts()
        },
        options: {
          rule: config.cronTable,
        }
      }
    });
  // Note that on cloud services like GAE, the above will not be needed,
  // and the config parameter will be false or not defined.  Instead,
  // the platform itself will schedule a request to the same API route
  // (/youtube-feed/fetch-posts) that the admin UI uses. This route must
  // not require authentication.
};

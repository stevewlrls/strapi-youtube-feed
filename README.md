# Strapi plugin youtube-feed

This plugin for the Strapi CMS enables the videos on a YouTube channel to be fetched into the Strapi database, from which they can then be used within a website. Only public data can be fetched, and complex posts with multiple videos may not be supported.

## Installation

Clone this repository into the `{strapi}/src/plugins` folder and then edit the Strapi config file `{strapi}/config/plugins.js` to include this plugin:

```js
module.exports = {
  'facebook-feed': {
    enabled: true,
    resolve: './src/plugins/facebook-feed',
  },
  // ...
}
```

Once the plugin is installed, you will also need to rebuild your admin UI, in the usual way, e.g.:

```
yarn build
```

## Usage

The plugin exposes a 'settings' page and a 'home' page. The former is for setting up details such as the channel to observe, whilst the latter provides a button to run the background 'fetch' process immediately.

The plugin requires a Google Cloud 'app' with permissions for the [YouTube Video API (v3)](https://developers.google.com/youtube/v3/docs). From this, you will need to copy your private API key into the settings data for the plugin.

## Content Model

You can see the content model for YouTube videos, once the plugin has been installed and initialised. You can also browse and even edit posts, after they have been fetched. You can use the content builder to modify the post fields, too: just remember to keep the same names! (If you add fields with different names, they'll be available for manual edit only.)

Posts are made available via the Strapi 'api' endpoint via the route `/api/youtube-feed/youtube-videos` just like other content types.

## Caveats

Once the plugin has been activated for the first time, content types can no longer be modified via the schema definitions within the plugin code. This is a feature of Strapi (v4).

The admin pages for the plugin (settings and home panel) are only available to users with 'Super administrator' role. This is again 'by design' and helps protect both sensitive data (app details) and correct operation of the plugin.

'use strict';

/**
 *  router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('plugin::youtube-feed.youtube-video', {
  type: 'content-api'
});

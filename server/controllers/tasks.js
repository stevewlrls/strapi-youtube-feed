'use strict';

module.exports = ({ strapi }) => ({
  async getSettings(ctx) {
    ctx.body = await strapi
      .plugin('youtube-feed')
      .service('tasks')
      .getSettings();
  },

  async saveSettings(ctx) {
    const { body } = ctx.request;
    ctx.body = await strapi
      .plugin('youtube-feed')
      .service('tasks')
      .saveSettings(body);
  },

  async fetchPosts(ctx) {
    ctx.body = await strapi
      .plugin('youtube-feed')
      .service('tasks')
      .fetchPosts();
  }
});

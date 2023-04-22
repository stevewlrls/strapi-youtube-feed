'use strict';

module.exports = ({ strapi }) => {
  // bootstrap phase
  strapi.cron.add({
    'youtube-fetch-items': {
      task: ({strapi}) => {
        strapi.plugin('youtube-feed')
          .service('tasks')
          .fetchPosts()
      },
      options: {
        // Once per day, at 11pm.
        rule: '0 0 23 * * *',
      }
    }
  })
};

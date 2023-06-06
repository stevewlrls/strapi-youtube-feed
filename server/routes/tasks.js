'use strict';

/**
 *  router
 */

module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/settings',
      handler: 'tasks.getSettings',
      config: {
        policies: [],
        // auth: false
      }
    },
    {
      method: 'POST',
      path: '/settings',
      handler: 'tasks.saveSettings',
      config: {
        policies: [],
        // auth: false
      }
    },
    {
      method: 'GET',
      path: '/fetch-posts',
      handler: 'tasks.fetchPosts',
      config: {
        policies: [],
        auth: false // Must be false, to allow cloud platform to invoke
      }
    },
  ],
}
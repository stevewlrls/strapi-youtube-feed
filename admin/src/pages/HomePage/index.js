/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from 'react';
import {
  BaseHeaderLayout, ContentLayout, Typography, Button, Box, Flex
} from '@strapi/design-system';
import { useNotification, getFetchClient } from '@strapi/helper-plugin';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

const HomePage = () => {
  const [params, setParams] = useState(null);
  const [isFetching, setFetching] = useState(false);
  const setNotice = useNotification();

  useEffect(getSettings, []);

  return (
    <>
      <BaseHeaderLayout
        title="Youtube Feed"
        subtitle="This plugin allows you to connect Strapi to a Youtube channel, to fetch posts into a
        Strapi collection (youtube-videos)."
      />
      <ContentLayout>
        {
          (params?.appKey && params?.channelId) ? (
            <Flex direction="column" alignItems="flex-start" gap="2">
              <p><Typography>
                You have already connected to a Youtube channel ({params?.channelName}), so
                you're ready to go.
              </Typography></p>
              <p><Typography>
                New posts will be fetched in the background (once a day, at around 11pm),
                but if you want to, you can trigger that operation now:
              </Typography></p>
              <Box padding="2">
                <Button
                  disabled={isFetching}
                  onClick={fetchPosts}
                >Fetch posts</Button>
              </Box>
            </Flex>
          ) : (
            <Typography>
              You have not yet connected to a Youtube channel. Use settings page for this plugin
              to define the channel and identify the 'app' to be used for the Youtube API.
            </Typography>
          )
        }

      </ContentLayout>
    </>
  );

  // getSettings
  //    Called on component mount, to fetch the Facebook app settings and
  // then attach the Facebook API.

  function getSettings() {
    const { get } = getFetchClient();
    get(`/${pluginId}/settings`)
      .then(rsp => {
        setParams(rsp.data);
      });
  }

  // fetchPosts
  //    Event handler for the 'Fetch posts' button. Requests the back end
  // (server) part of the plugin to fetch new posts now.

  function fetchPosts(ev) {
    setFetching(true);
    const { get } = getFetchClient();
    get(`/${pluginId}/fetch-posts`)
      .then(rsp => {
        setFetching(false);
        setNotice({
          type: 'success',
          message: `Fetch completed: ${rsp.data.fetched} new post(s).`
        });
      })
      .catch(err => {
        setFetching(false);
        setNotice({
          type: 'error',
          message: 'Fetch failed: ' + err.message
        })
      });
  }
};

export default HomePage;

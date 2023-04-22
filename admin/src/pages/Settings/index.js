import React, { useState, useEffect } from 'react';
import { HeaderLayout, ContentLayout, Button, TextInput, Grid, GridItem } from '@strapi/design-system';
import { useNotification, getFetchClient } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';

const Settings = () => {
  const [settings, updateSettings] = useState({
    appId: '',
    appKey: '',
  });
  const [isSaving, setSaving] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const setNotice = useNotification();

  useEffect(loadSettings, []);

  return (
    <>
      <HeaderLayout
        id="title"
        title="Youtube Feed Settings"
        primaryAction={
          <Button
            onClick={saveSettings}
            disabled={isSaving || isLoading}
          >Save</Button>
        }
      ></HeaderLayout>
      <ContentLayout>
        <Grid gap={4} gridCols={2}>
          <GridItem>
            <TextInput
              label="App ID"
              name="app-id"
              value={settings.appId}
              onChange={(e) => updateSettings({...settings, appId: e.target.value})}
            />
          </GridItem>
          <GridItem>
            <TextInput
              label="App key"
              name="app-key"
              value={settings.appKey}
              onChange={(e) => updateSettings({...settings, appKey: e.target.value})}
            />
          </GridItem>
          <GridItem>
            <TextInput
              label="Channel name"
              name="channel-name"
              value={settings.channelName}
              onChange={(e) => updateSettings({...settings, channelName: e.target.value})}
            />
          </GridItem>
          <GridItem>
            <TextInput
              label="Channel id"
              name="channel-id"
              value={settings.channelId}
              onChange={(e) => updateSettings({...settings, channelId: e.target.value})}
            />
          </GridItem>
        </Grid>
      </ContentLayout>
    </>
  )

  function loadSettings() {
    const { get } = getFetchClient();
    get(`/${pluginId}/settings`)
      .then(rsp => {
        updateSettings(rsp.data);
        setLoading(false);
      })
  }

  function saveSettings() {
    setSaving(true);
    const { post } = getFetchClient();
    const data = {...settings, referer: window.location.hostname}
    post(`/${pluginId}/settings`, data)
    .then(rsp => {
      setNotice({
        type: rsp.data.ok ? 'success' : 'error',
        message: rsp.data.ok ? 'Saved.' : rsp.data.error
      });
      setSaving(false);
    })
  }
};

export default Settings;
import React, { useState } from 'react';
import { Dimmer, Button, Header, Divider, Icon } from 'semantic-ui-react';
import { addNewContentAvailableListener } from '../../registerServiceWorker';
import { useOnMount } from 'react-hanger';

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

function usePwaUpdateChecker(props) {
  let [updated, setUpdated] = useState(false);

  useOnMount(() => {
    addNewContentAvailableListener('pwa-status', () => setUpdated(true));
  });

  return {
    updated,
    later() {
      setUpdated(false);
    }
  };
}

export default function PwaStatus() {
  const { updated, later } = usePwaUpdateChecker();
  return (
    <Dimmer active={updated} page>
      <Header as="h2" icon inverted>
        <Icon name="info" />
        New Update Available!
        <Header.Subheader>Reload to apply the updates</Header.Subheader>
        <Divider hidden />
        <Button primary content="Reload" onClick={() => window.location.reload()} />
        <Button inverted basic content="Later" onClick={() => later()} />
      </Header>
    </Dimmer>
  );
}

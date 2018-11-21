import React, { useState, useEffect } from "react";
import nanoid from "nanoid";
import get from "lodash/get";
import {
  Dimmer,
  Button,
  Header,
  Divider,
  Icon,
  Loader
} from "semantic-ui-react";
import {
  addNewContentAvailableListener,
  removeContentAvailableListener
} from "../../registerServiceWorker";
import { useOnMount } from "react-hanger";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function usePwaUpdateChecker(props) {
  let [updated, setUpdated] = useState(false);

  useOnMount(() => {
    addNewContentAvailableListener("pwa-status", () => setUpdated(true));
    // setTimeout(() => setUpdated(true), 5000);
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
  // const [reloadLater, setReloadLater] = useState(false);
  return (
    <Dimmer active={updated} page>
      <Header as="h2" icon inverted>
        <Icon name="info" />
        New Update Available!
        <Header.Subheader>
          Close all tabs to get latest version
        </Header.Subheader>
        <Divider hidden />
        <Button
          primary
          content="Reload"
          onClick={() => window.location.reload()}
        />
        <Button inverted basic content="Later" onClick={() => later()} />
      </Header>
    </Dimmer>
  );
}

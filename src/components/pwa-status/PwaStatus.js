import React, { useState, useEffect } from "react";
import nanoid from "nanoid";
import get from "lodash/get";
import { Dimmer, Button, Header, Divider, Icon } from "semantic-ui-react";

function usePwaUpdateChecker(props) {
  let [updated, setUpdated] = useState(false);
  const [checked, setChecked] = useState(false);

  async function checkStatus() {
    if (checked) return;
    try {
      const serverRequest = "/?t=" + nanoid();
      const [serverRoot, clientRoot] = await Promise.all([
        fetch(serverRequest),
        fetch("/index.html")
      ]);
      if (!serverRoot || serverRoot.status !== 200)
        throw new Error("Error could not connect to server");
      const [serverHtml, clientHtml] = await Promise.all([
        serverRoot.text(),
        clientRoot.text()
      ]);
      if (serverHtml === clientHtml || get(clientHtml, "length", 0) === 0) {
        console.log("no update needed");
        setChecked(true);
        return;
      }
      console.log("updating server caches...");
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        console.log(`updating index cache for ${cacheName}`);
        const cache = await caches.open(cacheName);
        const newRoot = await fetch(serverRequest);
        cache.put("/index.html", newRoot.clone());
      }
      setChecked(true);
      setUpdated(true);
    } catch (err) {
      console.log("Error occurred while checking for updates..");
      console.error(err);
      setChecked(true);
    }
  }

  useEffect(() => {
    checkStatus();
  });

  return { updated };
}

export default function PwaStatus() {
  const { updated } = usePwaUpdateChecker();
  const [reloadLater, setReloadLater] = useState(false);
  return (
    <Dimmer
      active={updated && !reloadLater}
      onClickOutside={() => setReloadLater(true)}
      page
    >
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
        <Button
          inverted
          basic
          content="Later"
          onClick={() => setReloadLater(true)}
        />
      </Header>
    </Dimmer>
  );
}

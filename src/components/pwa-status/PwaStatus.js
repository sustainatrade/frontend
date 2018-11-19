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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
      window.location.reload();
    } catch (err) {
      console.log("Error occurred while checking for updates..");
      console.error(err);
      setChecked(true);
    }
  }

  useEffect(() => {
    checkStatus();
  });

  return { updated, checked };
}

export default function PwaStatus() {
  const { updated, checked } = usePwaUpdateChecker();
  const [reloadLater, setReloadLater] = useState(false);
  const [timeoutReached, setTimeoutReached] = useState(false);
  useEffect(() => {
    sleep(10000).then(() => setTimeoutReached(true));
  });
  return (
    <Dimmer
      active={!checked}
      //  onClickOutside={() => setReloadLater(true)}
      page
    >
      <Header as="h2" icon inverted>
        <Loader indeterminate size="large" />
        {timeoutReached && (
          <>
            <Divider hidden style={{ marginBottom: 150 }} />
            Update is taking too long
            <div>
              <Button
                primary
                content="Reload"
                onClick={() => window.location.reload()}
              />
            </div>
          </>
        )}
      </Header>
    </Dimmer>
  );
}

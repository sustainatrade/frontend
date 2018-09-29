import React from "react";
import ls from "lscache";
import Notification from "antd/lib/notification";
import { Button } from "semantic-ui-react";

export default class CookiePopup extends React.Component {
  write() {
    ls.set("cookie-popup-accepted", 1);
  }
  componentDidMount() {
    const accepted = ls.get("cookie-popup-accepted");
    if (!accepted) {
      Notification.info({
        message: "This Website uses Cookies",
        description:
          "We use cookies to ensure that we give you the best experience on our website. If you continue to use this site we will assume that you are happy with it",
        btn: (
          <React.Fragment>
            <Button
              primary
              content="Ok"
              onClick={() => {
                this.write();
                Notification.close("cookie-popup");
              }}
            />{" "}
            <Button
              as="a"
              href="https://static.sustainatrade.com/privacy-policy/"
              target="_blank"
              content="Read More"
            />
          </React.Fragment>
        ),
        key: "cookie-popup",
        duration: 0,
        placement: "bottomRight",
        onClose: () => {
          this.write();
        }
      });
    }
  }
  render() {
    return <React.Fragment />;
  }
}

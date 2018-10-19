import React from "react";
import EcoContent from "./modules/Content";
import RootContextProvider from "./contexts";
import ResponsiveContext from "./contexts/Responsive";
import { Divider, Menu, Dimmer, Header, Button, Icon } from "semantic-ui-react";

import CookiePopup from "./components/cookie-popup/CookiePopup";
import loadable from "loadable-components";
import "./App.css";
import config from "config";
import get from "lodash/get";

// Antd component styles here
import "antd/lib/drawer/style/css";
import "antd/lib/upload/style/css";
import "antd/lib/modal/style/css";
import "antd/lib/notification/style/css";
import "antd/lib/slider/style/css";
import "antd/lib/timeline/style/css";
import "antd/lib/popover/style/css";
import "antd/lib/icon/style/css";
import { FacebookProvider } from "react-facebook";
import Modal from "antd/lib/modal";
import Globals from "./modules/globals";
// Service worker
import {
  addNewContentAvailableListener,
  unregister
} from "./registerServiceWorker";

const EmptyHeader = () => (
  <Menu className="top-header">
    <Menu.Item>...</Menu.Item>
  </Menu>
);

const MainHeader = loadable(
  () => import(`./components/main-header/MainHeader`),
  {
    LoadingComponent: () => <EmptyHeader />
  }
);

class Root extends React.Component {
  state = {
    showMobileSidebar: false,
    showReloader: false
  };
  async componentWillMount() {
    addNewContentAvailableListener("app", () => {
      console.log("new update available");
      this.setState({ showReloader: true });
    });
    //check sw version from server
    console.log("window.clientSwVersion"); //TRACE
    console.log(window.clientSwVersion); //TRACE
    const ret = await fetch(config.swConfigUrl, {
      method: "post"
    });
    const swConfig = await ret.json();
    console.log("swConfig"); //TRACE
    console.log(swConfig); //TRACE
    const serverSwVersion = get(swConfig, "version");
    if (serverSwVersion !== window.clientSwVersion) {
      this.setState({ showReloader: true });
      unregister();
    }
  }

  render() {
    const { showMobileSidebar, showReloader } = this.state;

    return (
      <RootContextProvider>
        <ResponsiveContext.Consumer>
          {({ isMobile, ...rest }) => {
            return (
              <React.Fragment>
                <MainHeader
                  reponsiveContext={{ isMobile, ...rest }}
                  showMobileSidebar={showMobileSidebar}
                  onSetShowMobileSidebar={flag =>
                    this.setState({ showMobileSidebar: flag })
                  }
                />

                <div>
                  <FacebookProvider appId="512081562521251">
                    <EcoContent
                      showSidebar={isMobile ? showMobileSidebar : true}
                    />
                    <CookiePopup />
                  </FacebookProvider>
                </div>
                {isMobile && (
                  <Modal
                    visible={showMobileSidebar}
                    zIndex={900}
                    onCancel={() => this.setState({ showMobileSidebar: false })}
                    width={10}
                    style={{ top: 0, left: 0, display: "none" }}
                    footer={null}
                  />
                )}
              </React.Fragment>
            );
          }}
        </ResponsiveContext.Consumer>
        <Dimmer
          active={showReloader}
          onClickOutside={() => this.setState({ showReloader: false })}
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
              onClick={() => this.setState({ showReloader: false })}
            />
          </Header>
        </Dimmer>
        <Globals />
      </RootContextProvider>
    );
  }
}

export default Root;

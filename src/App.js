import React, { useContext } from "react";
import EcoContent from "./modules/Content";
import RootContextProvider from "./contexts";
import { Context as ResponsiveContext } from "./contexts/Responsive";
import { Context as LayoutContext } from "./contexts/LayoutContext";
import { Divider, Menu, Dimmer, Header, Button, Icon } from "semantic-ui-react";

import PwaStatus from "./components/pwa-status/PwaStatus";
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

function HeaderWrapper() {
  const { isMobile, ...rest } = useContext(ResponsiveContext);
  const { showSidebar, setShowSidebar } = useContext(LayoutContext);
  return (
    <>
      <MainHeader
        reponsiveContext={{ isMobile, ...rest }}
        showMobileSidebar={isMobile ? showSidebar : true}
        onSetShowMobileSidebar={flag => setShowSidebar(flag)}
      />
      {isMobile && (
        <Modal
          visible={showSidebar}
          zIndex={900}
          onCancel={() => setShowSidebar(false)}
          width={10}
          style={{ top: 0, left: 0, display: "none" }}
          footer={null}
        />
      )}
    </>
  );
}

class Root extends React.Component {

  render() {
    return (
      <RootContextProvider>
        <React.Fragment>
          <HeaderWrapper />
          <FacebookProvider appId="512081562521251">
            <EcoContent />
            <CookiePopup />
          </FacebookProvider>
        </React.Fragment>
        <PwaStatus />
        <Globals />
      </RootContextProvider>
    );
  }
}

export default Root;

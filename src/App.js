import { UserAuth } from "./components";
import React from "react";
import EcoContent from "./modules/Content";
import RootContextProvider from "./contexts";
import ResponsiveContext from "./contexts/Responsive";
import {
  Menu,
  Dropdown,
  Divider,
  Dimmer,
  Label,
  Header,
  Button,
  Container,
  Icon
} from "semantic-ui-react";

// Antd component styles here
import "antd/lib/upload/style/css";
import "antd/lib/modal/style/css";
import "antd/lib/notification/style/css";
import "antd/lib/slider/style/css";
import "antd/lib/timeline/style/css";
import "antd/lib/popover/style/css";
import FacebookProvider from "react-facebook";
import Modal from "antd/lib/modal";
import Globals from "./modules/globals";
import logo from "./sat.png";
// Service worker
import { addNewContentAvailableListener } from "./registerServiceWorker";
import { Link } from "@reach/router";

import PropTypes from "prop-types";

Dropdown.Item.propTypes = {
  ...Dropdown.Item.propTypes,
  as: PropTypes.any
};

const CenterItem = ({ children, as = Menu, ...otherProps }) => (
  <as.Item as="a" {...otherProps}>
    <span style={{ margin: "auto" }}>{children}</span>
  </as.Item>
);
export const Menus = ({ mobile }) => {
  const staticDomain = `//static.${window.location.host}`;
  return (
    <React.Fragment>
      <CenterItem href="/">
        <img height="25" alt="" src={logo} />

        <Label color="red" horizontal size="mini">
          beta
        </Label>
      </CenterItem>
      <Dropdown
        item
        openOnFocus
        text="Discover"
        simple
        style={{ fontWeight: "bold" }}
        icon="map marker alternate"
      >
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to="/">
            <Icon name="cubes" />
            Items
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/u">
            <Icon name="users" /> Traders
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <CenterItem href={staticDomain + "/about"}>About</CenterItem>
      <CenterItem href={staticDomain + "/blog"}>Blog</CenterItem>
      <CenterItem href={staticDomain + "/send-feedback"}>
        Send Feedback
      </CenterItem>
      <Dropdown
        item
        icon="ellipsis horizontal"
        style={mobile ? { paddingLeft: "46%" } : undefined}
      >
        <Dropdown.Menu>
          <CenterItem as={Dropdown} href={staticDomain + "/privacy-policy"}>
            Privacy
          </CenterItem>
          <CenterItem as={Dropdown} href={staticDomain + "/terms"}>
            Terms
          </CenterItem>
          <CenterItem as={Dropdown} href={staticDomain + "/faq"}>
            FAQ
          </CenterItem>
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

class Root extends React.Component {
  state = {
    showMobileSidebar: false,
    showReloader: false
  };
  componentWillMount() {
    addNewContentAvailableListener("app", () => {
      console.log("new update available");
      this.setState({ showReloader: true });
    });
  }

  render() {
    const { showMobileSidebar, showReloader } = this.state;

    return (
      <RootContextProvider>
        <ResponsiveContext.Consumer>
          {({ isMobile }) => {
            return (
              <React.Fragment>
                <Menu
                  style={{
                    borderRadius: 0,
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "50px",
                    zIndex: 902,
                    backgroundColor: "white"
                  }}
                >
                  {!isMobile && (
                    <React.Fragment>
                      <Menus />
                    </React.Fragment>
                  )}
                  {isMobile && (
                    <Menu.Item
                      onClick={() =>
                        this.setState({ showMobileSidebar: !showMobileSidebar })
                      }
                    >
                      <Icon
                        size="large"
                        name={!showMobileSidebar ? "content" : "x"}
                      />
                    </Menu.Item>
                  )}

                  <Menu.Menu position="right" style={{ paddingTop: 7 }}>
                    <UserAuth />
                  </Menu.Menu>
                </Menu>
                <Container fluid>
                  <FacebookProvider appId="512081562521251">
                    <EcoContent
                      showSidebar={isMobile ? showMobileSidebar : true}
                    />
                  </FacebookProvider>
                </Container>
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
            <Header.Subheader>I need you to refresh this page</Header.Subheader>
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

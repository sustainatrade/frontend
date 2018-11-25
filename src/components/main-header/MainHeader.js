import React from "react";
import { Menu, Icon, Dropdown, Label } from "semantic-ui-react";
import logo from "./sat.png";
import config from "config";
import { Link } from "@reach/router";

import PropTypes from "prop-types";
import UserAuth from "../user-auth/UserAuth";
import GlobalSearch from "../global-search/GlobalSearch";

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
  // const staticDomain = `//static.${window.location.host}`;
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
        style={{ fontWeight: "bold", paddingLeft: mobile && 80 }}
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
      <CenterItem href={config.staticPages.about}>About</CenterItem>
      <CenterItem href={config.staticPages.blog}>Blog</CenterItem>
      <CenterItem href={config.staticPages.feedback}>Send Feedback</CenterItem>
      <Dropdown
        item
        icon="ellipsis horizontal"
        style={mobile ? { paddingLeft: "46%" } : undefined}
      >
        <Dropdown.Menu>
          <CenterItem as={Dropdown} href={config.staticPages.privacy}>
            Privacy
          </CenterItem>
          <CenterItem as={Dropdown} href={config.staticPages.terms}>
            Terms
          </CenterItem>
          <CenterItem as={Dropdown} href={config.staticPages.faq}>
            FAQ
          </CenterItem>
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

const MainHeader = ({
  reponsiveContext: { isMobile },
  onSetShowMobileSidebar,
  showMobileSidebar
}) => (
  <Menu className="top-header">
    {!isMobile && (
      <React.Fragment>
        <Menus />
      </React.Fragment>
    )}
    {isMobile && (
      <Menu.Item
        active={showMobileSidebar}
        onClick={() => onSetShowMobileSidebar(!showMobileSidebar)}
      >
        {/* <Icon
                        size="large"
                        name={!showMobileSidebar ? "content" : "x"}
                      /> */}
        <img style={{ width: 25 }} alt="" src={logo} />
        <Icon
          name={showMobileSidebar ? "caret square down" : "caret down"}
          size="large"
          color={showMobileSidebar ? "black" : "grey"}
        />
      </Menu.Item>
    )}
    <Menu.Menu
      position="right"
      style={(() => {
        const style = { paddingTop: 5 };
        if (isMobile) {
          style.width = "55%";
          style.marginRight = "70px";
        }
        return style;
      })()}
    >
      <GlobalSearch fluid={isMobile} />
      <UserAuth compact={isMobile} open />
    </Menu.Menu>
  </Menu>
);

export default MainHeader;

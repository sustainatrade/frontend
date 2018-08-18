import React, { Component } from "react";
import { Segment } from "semantic-ui-react";
import Sidebar from "./Sidebar";
import PostFeed from "./post-feed";
import Home from "./home";
import UserList from "./user-list";
import ResponsiveContext from "./../contexts/Responsive";
import { Router } from "@reach/router";

export default class EcoContent extends Component {
  state = { visible: false };

  render = () => (
    <ResponsiveContext.Consumer>
      {({ isMobile }) => {
        const { showSidebarScroll } = this.state;
        const { showSidebar } = this.props;
        const style1 = {},
          style2 = {
            left: "0",
            position: "fixed",
            top: "50px",
            bottom: "0",
            width: 250,
            zIndex: 901,
            backgroundColor: "#e2e2e2",
            overflowY: showSidebarScroll ? "scroll" : "hidden"
          },
          style3 = { paddingRight: 5, width: 240 };
        if (!isMobile) {
          style1.paddingLeft = 255;
          style3.paddingTop = 0;
        } else {
          style2.overflowY = "scroll";
        }
        style1.paddingTop = 55;
        style1.paddingRight = 5;
        return (
          <div style={style1}>
            {showSidebar && (
              <div
                style={style2}
                onMouseEnter={() => this.setState({ showSidebarScroll: true })}
                onMouseLeave={() =>
                  this.setState({ showSidebarScroll: undefined })
                }
              >
                <Segment basic style={style3}>
                  <Sidebar />
                </Segment>
              </div>
            )}
            <Router>
              <UserList path="u/*" />
              <PostFeed path="p/*" />
              <Home default />
            </Router>
          </div>
        );
      }}
    </ResponsiveContext.Consumer>
  );
}

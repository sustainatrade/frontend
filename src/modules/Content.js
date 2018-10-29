import React, { useState, useContext, useEffect } from "react";
import { Segment } from "semantic-ui-react";
import { GlobalConsumer } from "./../contexts";
import { Loader } from "semantic-ui-react";
import { Router } from "@reach/router";
import loadable from "loadable-components";
import Home from "./home";
import { Context as LegacyContext } from "./../contexts/LayoutContext";
import { Context as ResponsiveContext } from "./../contexts/Responsive";

const CreatePost = loadable(() => import(`./create-post`), {
  LoadingComponent: () => <Loader inline="centered" />
});

const Sidebar = loadable(() => import(`./Sidebar`), {
  LoadingComponent: () => <div />
});

export const createPageRoute = importObj => {
  return loadable(() => import(`${importObj}`), {
    LoadingComponent: () => <Loader inline="centered" />
  });
};

const UserList = createPageRoute("./user-list");
// const Home = createPageRoute("./home");
const PostFeed = createPageRoute("./post-feed");
const TagFeed = createPageRoute("./tag-feed");

function SidebarWrapper() {
  const { isMobile } = useContext(ResponsiveContext);
  const [showSidebarScroll, setState] = useState(null);

  const style2 = {
      left: "0",
      position: "fixed",
      top: "50px",
      bottom: "0",
      width: 250,
      zIndex: 901,
      backgroundColor: "#f3f4f5",
      overflowY: showSidebarScroll ? "scroll" : "hidden"
    },
    style3 = { paddingRight: 5, width: 240 };

  if (!isMobile) {
    style3.paddingTop = 0;
  } else {
    style2.overflowY = "scroll";
  }

  return (
    <div
      style={style2}
      onMouseEnter={() => setState(true)}
      onMouseLeave={() => setState(null)}
    >
      <Segment basic style={style3}>
        <Sidebar />
      </Segment>
    </div>
  );
}

export default function() {
  const { showSidebar, setShowSidebar } = useContext(LegacyContext);
  const { isMobile } = useContext(ResponsiveContext);
  const [state] = useState({});
  const { wrapperActive } = state;
  useEffect(
    () => {
      if (!isMobile) {
        setShowSidebar(true);
      }
    },
    [isMobile]
  );
  return (
    <GlobalConsumer>
      {({
        responsive: { isMobile, stretched },
        postView: { post, closeFn }
      }) => {
        const style1 = {};
        if (!isMobile) {
          style1.paddingLeft = 255;
        }
        style1.paddingTop = 55;
        style1.paddingRight = isMobile ? 0 : 5;
        if (wrapperActive) {
          style1.visibility = "collapse";
        }
        return (
          <div
            className={stretched ? "content-panel" : undefined}
            style={style1}
          >
            {showSidebar && <SidebarWrapper />}
            <Router primary={false} className="content-panel">
              <UserList path="u/*" />
              <TagFeed path="t/:tagName" />
              <PostFeed path="p/*" />
              <CreatePost path="create/*" />
              <Home exact default />
            </Router>
          </div>
        );
      }}
    </GlobalConsumer>
  );
}

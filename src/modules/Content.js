import React, { useState, useContext, useEffect } from "react";
import { Segment, Button, Header } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Router } from "@reach/router";
import loadable from "loadable-components";
import Home from "./home";
import { Context as LayoutContext } from "./../contexts/LayoutContext";
import { Context as ResponsiveContext } from "./../contexts/Responsive";
import ThemeContext from "../contexts/ThemeContext";

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
  const { secondaryBgColor } = useContext(ThemeContext.Context);
  const [showSidebarScroll, setState] = useState(null);

  const style2 = {
      left: "0",
      position: "fixed",
      top: "50px",
      bottom: "0",
      width: 250,
      zIndex: 901,
      backgroundColor: secondaryBgColor,
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

function SubHeaderWrapper() {
  const { subHeader, contentStyle, hideBackButton } = useContext(LayoutContext);
  const { isMobile } = useContext(ResponsiveContext);
  const { secondaryBgColor } = useContext(ThemeContext.Context);
  console.log("contentStyle wra"); //TRACE
  console.log(contentStyle); //TRACE
  let HeaderComp;
  if (typeof subHeader === "string") {
    const textLimit = isMobile ? 30 : 100;
    HeaderComp = (
      <span
        style={{
          padding: 0,
          margin: 0,
          color: "darkgray",
          fontWeight: "bold",
          fontSize: "larger"
        }}
      >
        {`  ${subHeader.substr(0, textLimit)}${
          subHeader.length > textLimit ? "..." : ""
        }`}
      </span>
    );
  }

  const style = {
    backgroundColor: "snow",
    position: "fixed",
    zIndex: 903,
    padding: 6,
    top: isMobile ? 0 : contentStyle.paddingTop - 50,
    right: 0,
    left: contentStyle.paddingLeft,
    height: 50,
    borderBottom: `solid 1px lightgray`,
    WebkitBoxShadow: "0 1px 5px 0 rgba(34,36,38,.15)",
    boxShadow: "0 1px 5px 0 rgba(34,36,38,.15)"
  };
  return (
    <div style={style}>
      {!hideBackButton && (
        <Button
          icon="reply"
          onClick={() => {
            window.history.back();
          }}
        />
      )}
      {HeaderComp || subHeader}
    </div>
  );
}

export default function() {
  const { showSidebar, setShowSidebar, subHeader, contentStyle } = useContext(
    LayoutContext
  );
  const { isMobile, stretched } = useContext(ResponsiveContext);

  useEffect(
    () => {
      if (!isMobile) {
        setShowSidebar(true);
      }
    },
    [isMobile]
  );

  return (
    <div
      className={stretched ? "content-panel" : undefined}
      style={contentStyle}
    >
      {showSidebar && <SidebarWrapper />}
      {!!subHeader && <SubHeaderWrapper />}
      <Router primary={false} className="content-panel">
        <UserList path="u/*" />
        <TagFeed path="t/:tagName" />
        <PostFeed path="p/*" />
        <CreatePost path="create/*" />
        <Home exact default />
      </Router>
    </div>
  );
}

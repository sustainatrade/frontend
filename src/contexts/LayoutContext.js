import React, { useState, useContext } from "react";
import { Context as ResponsiveCtx } from "./Responsive";
import { useWindowSize } from "the-platform";

export const Context = React.createContext({});

function Provider({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [subHeader, showSubHeader] = useState(null);
  const [hideBackButton, setHideBackButton] = useState(false);
  const [showIconScroller, setShowIconScroller] = useState(false);
  const windowSize = useWindowSize();
  // const [contentStyle, setContentStyle] = useState({

  // });
  const contentStyle = {};
  const { isMobile } = useContext(ResponsiveCtx);
  // contentStyle.paddingTop = !!subHeader ? 100 : 50;
  contentStyle.paddingTop = !!subHeader && !isMobile ? 100 : 50;
  contentStyle.paddingLeft = isMobile ? 0 : 250;
  contentStyle.paddingRight = 0;

  const contextState = {
    contentStyle,
    showSidebar,
    setShowSidebar,
    subHeader,
    showSubHeader,
    hideBackButton,
    setHideBackButton,
    showIconScroller,
    setShowIconScroller,
    iconScrollWidth: 5,
    contentPadding: 10,
    windowSize
  };
  return <Context.Provider value={contextState}>{children}</Context.Provider>;
}

export default {
  Provider,
  Consumer: Context.Consumer,
  Context
};

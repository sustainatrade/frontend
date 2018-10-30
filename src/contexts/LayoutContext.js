import React, { useState, useContext } from "react";
import { Context as ResponsiveCtx } from "./Responsive";

export const Context = React.createContext({});

function Provider({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [subHeader, showSubHeader] = useState(null);
  const [hideBackButton, setHideBackButton] = useState(false);
  // const [contentStyle, setContentStyle] = useState({

  // });
  const contentStyle = {};
  const { isMobile } = useContext(ResponsiveCtx);
  contentStyle.paddingTop = !!subHeader ? 105 : 55;
  contentStyle.paddingLeft = isMobile ? 0 : 255;
  contentStyle.paddingRight = isMobile ? 0 : 5;

  const contextState = {
    contentStyle,
    showSidebar,
    setShowSidebar,
    subHeader,
    showSubHeader,
    hideBackButton,
    setHideBackButton
  };
  return <Context.Provider value={contextState}>{children}</Context.Provider>;
}

export default {
  Provider,
  Consumer: Context.Consumer
};

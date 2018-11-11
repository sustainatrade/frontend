import React, { useState, useContext } from "react";

export const Context = React.createContext({});

function Provider({ children }) {
  // const [showSidebar, setShowSidebar] = useState(false);
  // const [subHeader, showSubHeader] = useState(null);

  const contextState = {
    secondaryBgColor: "#f3f4f5",
    mainBgColor: "seagreen"
  };
  return <Context.Provider value={contextState}>{children}</Context.Provider>;
}

export default {
  Provider,
  Consumer: Context.Consumer,
  Context
};

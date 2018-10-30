import React, { useState } from "react";

export const Context = React.createContext({});

function Provider({ children }) {
  const [state, setState] = useState({ showSidebar: false });
  const contextState = {
    ...state,
    setShowSidebar: showSidebar => {
      setState({ showSidebar });
    }
  };
  return <Context.Provider value={contextState}>{children}</Context.Provider>;
}

export default {
  Provider,
  Consumer: Context.Consumer
};

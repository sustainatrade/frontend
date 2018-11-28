import React, { useState, useContext } from 'react';
import { colors } from './../themes/config';
import { defaultBgImage } from './../config';
export const Context = React.createContext({});

function Provider({ children }) {
  // const [showSidebar, setShowSidebar] = useState(false);
  // const [subHeader, showSubHeader] = useState(null);
  const [background, setBackground] = useState(defaultBgImage); //'https://svgshare.com/i/9au.svg'
  const contextState = {
    secondaryBgColor: '#f3f4f5',
    mainBgColor: 'white',
    colors,
    background,
    setBackground
  };
  return <Context.Provider value={contextState}>{children}</Context.Provider>;
}

export default {
  Provider,
  Consumer: Context.Consumer,
  Context
};

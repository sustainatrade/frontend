import React, { useState, useContext } from 'react';
import { Map } from 'immutable';

export const Context = React.createContext({});

function Provider({ children }) {
  const [stateMap, setStateMap] = useState(Map({ opened: false, closing: false }));
  const state = {
    ...stateMap.toJS(),
    open: flag =>
      setStateMap(map => {
        return map.set('opened', flag).set('closing', false);
      }),
    close: () =>
      setStateMap(map => {
        return map.set('closing', true);
      })
  };
  return <Context.Provider value={state}>{children}</Context.Provider>;
}

export default {
  Provider,
  Consumer: Context.Consumer,
  Context
};

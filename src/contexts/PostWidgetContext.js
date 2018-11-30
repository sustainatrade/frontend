import React, { useState, useMemo } from 'react';
import { LAST_DRAFT, POST, UPDATE_POST_WIDGETS } from '../gql-schemas';
import apolloClient from './../lib/apollo';
import compact from 'lodash/compact';
import get from 'lodash/get';
import { contents } from './../components/widgets';
import { fromJS } from 'immutable';
import { useContent } from './../hooks/Content';

export const Context = React.createContext({});

function Provider({ children }) {
  const allContentKeys = useMemo(() => {
    return Object.keys(contents);
  });

  const [state, setState] = useState({
    submitting: false
  });

  const [contentEditorHeight, setContentEditorHeight] = useState(null);
  const [currentContent, setCurrentContent] = useState(null);
  const [lastTouchKeys, setLastTouchKeys] = useState([]);
  const [defaultContentCode, setDefaultContentCode] = useState(null); // allContentKeys[0]
  const [contentKeys, setContentKeys] = useState(allContentKeys);
  const allState = {
    ...state,
    currentContent,
    setCurrentContent,
    defaultContentCode,
    setDefaultContentCode,
    contentKeys,
    setContentKeys,
    contentEditorHeight,
    setContentEditorHeight,
    lastTouchKeys,
    setLastTouchKeys,
    reset() {
      setCurrentContent(null);
      setLastTouchKeys([]);
    },
    submitWidgetsFn: async (widgetArray, { newWidget } = {}) => {
      setState({ submitting: true });
      setLastTouchKeys([]);
      let hasDelete,
        hasCreate,
        lastTouchKeys = [];
      const newWidgets = widgetArray.map(widget => {
        if (widget.__deleted) {
          widget.type = 'DELETE';
          widget.values = {};
          hasDelete = true;
          if (!widget._refNo) return null; //Not changed
        } else if (widget._refNo) {
          widget.type = 'MODIFY';
        } else {
          widget.type = 'CREATE';
          hasCreate = true;
        }

        // const widgetInput = Object.assign({}, widget, {
        //   values: JSON.stringify(widget.values)
        // });
        const widgetInput = fromJS(widget)
          .update('values', vals => JSON.stringify(vals))
          .toJS();
        delete widgetInput.__deleted;
        delete widgetInput.propValues;
        delete widgetInput.key;
        return widgetInput;
      });
      try {
        const ret = await apolloClient.mutate({
          mutation: UPDATE_POST_WIDGETS.query,
          variables: {
            widgets: compact(newWidgets)
          },
          refetchQueries: () => [LAST_DRAFT.key, POST.key]
        });
        const touched = get(ret, `data.${UPDATE_POST_WIDGETS.key}.widgets`, []).map(wdg =>
          get(wdg, '_refNo')
        );
        console.log('touched', touched); //TRACE
        const newState = { submitting: false };
        setState(newState);
        setCurrentContent(null);
        setLastTouchKeys(touched);
        return ret.data.UpdatePostWidgets.widgets;
      } catch (err) {
        setState({ submitting: false });
        throw err;
      }
    }
  };
  return <Context.Provider value={allState}>{children}</Context.Provider>;
}

export default {
  Provider,
  Consumer: Context.Consumer,
  Context
};

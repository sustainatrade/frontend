import React, { useState } from "react";
import * as gql from "./../gql-schemas";
import apolloClient from "./../lib/apollo";
import get from "lodash/get";
import { navigate } from "@reach/router";
import { getUrl } from "./PostFeedContext";
import { List } from "immutable";

export const Context = React.createContext({});

function Provider({ children }) {
  const [postStack, setStack] = useState(List([])); //current posts visible to screen

  function get(stack, id) {
    return stack.findIndex(post => post.id === id);
  }
  const allState = {
    postStack,
    get,
    add({ post, ...rest }) {
      setStack(stack => {
        if (get(stack, post.id) < 0) {
          return stack.push({ id: post.id, post, ...rest });
        }
        return stack;
      });
    },
    update(id, { post, ...rest }) {
      setStack(stack => {
        const idx = get(stack, id);
        const obj = { id: post.id, post, ...rest };
        if (idx > -1) return stack.set(idx, obj);
        else return stack.push(obj);
      });
    },
    remove(id) {
      setStack(stack => {
        const idx = get(stack, id);

        if (idx > -1) return stack.delete(idx);
        else return stack;
      });
    }
  };

  return <Context.Provider value={allState}>{children}</Context.Provider>;
}

export default {
  Provider,
  Consumer: Context.Consumer,
  Context
};

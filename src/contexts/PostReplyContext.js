import React, { useState } from "react";
import * as gql from "./../gql-schemas";
import apolloClient from "./../lib/apollo";
import get from "lodash/get";
import { navigate } from "@reach/router";
import { getUrl } from "./PostFeedContext";

export const Context = React.createContext({});

function Provider({ children }) {
  const [state, setState] = useState({
    submitting: false
  });

  const [parentPost, setParentPost] = useState(null);

  const allState = {
    ...state,
    parentPost,
    setParentPost,
    reset() {
      setState({ submitting: false });
      setParentPost(null);
    },
    postReply: async ({ refNo }) => {
      setState({ submitting: true });
      console.log("querying..");

      const ret = await apolloClient.mutate({
        mutation: gql.PUBLISH_POST.query,
        variables: {
          refNo: refNo
        },
        refetchQueries: () => [gql.POST.key]
      });
      setState({ submitting: false });
      setParentPost(null);
      const post = get(ret, "data.PublishPost.post");
      navigate(getUrl(post));
    }
  };

  return <Context.Provider value={allState}>{children}</Context.Provider>;
}

export default {
  Provider,
  Consumer: Context.Consumer,
  Context
};

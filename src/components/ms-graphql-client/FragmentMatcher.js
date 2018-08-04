import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: "UNION",
          name: "Event",
          possibleTypes: [{ name: "RemovedPost" }, { name: "Post" }]
        } // this is an example, put your INTERFACE and UNION kinds here!
      ]
    }
  }
});

export default fragmentMatcher;

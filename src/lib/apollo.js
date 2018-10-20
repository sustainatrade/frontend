import { graphqlServer, graphqlWsServer } from "../config";
import { MsGraphqlClient } from "../components";

const client = MsGraphqlClient(graphqlServer, graphqlWsServer);

export function cleanError(error) {
  if (!error) return;
  return {
    message: error.message.replace("GraphQL error:", "").trim()
  };
}

export default client;

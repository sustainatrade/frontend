import React from "react";
import ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { ApolloProvider } from "react-apollo";
import apolloClient from "./lib/apollo";

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Sustainatrade</title>
    </Helmet>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
registerServiceWorker();

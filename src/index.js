import React from "react";
import ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { ApolloProvider } from "react-apollo";
import apolloClient from "./lib/apollo";
import config from "./config";

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{config.siteName}</title>
      </Helmet>
      <App />
    </React.Fragment>
  </ApolloProvider>,
  document.getElementById("root")
);
registerServiceWorker();

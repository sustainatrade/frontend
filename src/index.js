import React from "react";
import ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { ApolloProvider } from "react-apollo";
import apolloClient from "./lib/apollo";


ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sustain@trade</title>
      </Helmet>
      <App />
    </React.Fragment>
  </ApolloProvider>,
  document.getElementById("root")
);
registerServiceWorker();

module.exports = Object.assign(
  {
    siteName: "Sustain@trade",
    publicToken: "please no hax",
    facebookAppId: "320301788758144",
    graphqlServer: localStorage.getItem("graphql"),
    graphqlWsServer: localStorage.getItem("graphql-ws"),
    reqCredentials: "include",
    sections: [
      {
        key: "question",
        color: "yellow",
        displayName: "Questions"
      },
      {
        key: "answer",
        color: "blue",
        displayName: "Answers"
      },
      {
        key: "buy",
        color: "orange",
        displayName: "Buying"
      },
      {
        key: "sell",
        color: "green",
        displayName: "Selling"
      }
    ],
    posts: {
      actionButtonSize: "tiny"
    },
    staticPages: {
      privacy: "",
      about: "https://www.sustainatrade.com"
    },
    swConfigUrl:
      process.env["NODE_ENV"] === "production"
        ? "/sw-config"
        : "http://localhost:3001/sw-config"
  },
  window.OVERRIDE_CONFIG
);

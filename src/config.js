module.exports = Object.assign(
  {
    siteName: "Sustain@trade",
    publicToken: "please no hax",
    facebookAppId: "320301788758144",
    graphqlServer: localStorage.getItem("graphql"),
    graphqlWsServer: localStorage.getItem("graphql-ws"),
    reqCredentials: "include",
    sections: [],
    contents: [
      {
        code: "buy-item",
        name: "Buying Item",
        icon: { type: "shopping-cart", theme: "outlined" }
      },
      {
        code: "sell-item",
        name: "Selling Item",
        icon: { type: "shop", theme: "outlined" }
      },
      {
        code: "text",
        name: "Text",
        icon: { type: "font-size", theme: "outlined" }
      }
    ],
    posts: {
      actionButtonSize: "medium"
    },
    staticPages: {
      privacy: "",
      about: "https://www.sustainatrade.com",
      terms: "https://www.sustainatrade.com",
    },
    swConfigUrl:
      process.env["NODE_ENV"] === "production"
        ? "/sw-config"
        : "http://localhost:3001/sw-config"
  },
  window.OVERRIDE_CONFIG
);

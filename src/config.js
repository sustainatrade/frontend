module.exports = {
  graphqlServer: localStorage.getItem("graphql"),
  graphqlWsServer: localStorage.getItem("graphql-ws"),
  reqCredentials: "include",
  sections: [
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
  ]
};

const axios = require("axios");
const { localGraphqlServer, env } = require("./../config");

//TODO: add api host checker here/ healthcheck
const apiClient = {
  async query({ query, variables }) {
    const { data } = await axios.post(
      localGraphqlServer,
      {
        query,
        variables
      },
      {
        headers: { authorization: env.publicToken }
      }
    );
    return data;
  },
  async mutate({ query, variables }) {
    const { data } = await axios.post(
      localGraphqlServer,
      {
        query,
        variables
      },
      {
        headers: { authorization: env.publicToken }
      }
    );
    return data;
  }
};

module.exports = {
  apiClient
};

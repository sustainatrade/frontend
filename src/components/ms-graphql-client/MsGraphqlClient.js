import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, from, split } from 'apollo-link';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import {onError, d} from 'apollo-link-error';
const afterWareLink = onError(({operation, response, graphQLErrors, networkError}) => {

  const { variables } = operation || {};
  let keys = [];
  if(variables){
    for (const key in variables) {
      const hash = variables[key]._hash
      if(hash){
        keys.push(hash);
      }
    }
  }
  if(keys.length===0)
    return console.warn('An Error was unhandled! ');
  for (const eKey of keys) {
    const errObj = {
      graphQLErrors,
      networkError
    }
    localStorage.setItem('ERR:'+eKey, JSON.stringify(errObj))
    console.log('Error logged to : ERR:'+eKey)
  }
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => {
      const cokke = localStorage.getItem('_c')
      return {
        headers: {
          ...headers,
          authorization: cokke || null,
        } 
      }       
  });
  return forward(operation);
})


//'http://localhost:1560/graphql'
const client = function(graphqlUrl,wsGraphqlUrl){
  
  const wsLink = new WebSocketLink({
    uri: wsGraphqlUrl,
    options: {
      reconnect: true
    }
  });
  const httpLink = new HttpLink({ uri: graphqlUrl, credentials: 'include'});

    const allLink = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      httpLink,
    );

    return new ApolloClient({
      link: from([
          authMiddleware,
          afterWareLink,
          allLink
      ]),
      cache: new InMemoryCache(),
    });
}

export default client;
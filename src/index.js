import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider } from 'react-apollo';
import apolloClient from './lib/apollo'
 
ReactDOM.render(
    <ApolloProvider client={apolloClient}>
        <App />
    </ApolloProvider>,
    document.getElementById('root'));
registerServiceWorker();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { RootSession } from './Routes/index'
import * as serviceWorker from './serviceWorker';
import 'rsuite/dist/styles/rsuite-default.css';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloProvider } from 'react-apollo';
import { Notification } from 'rsuite';

const uploadLink = createUploadLink({ uri: "https://procapsulasapi.herokuapp.com/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    }
  }
});

const linkError = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      // eslint-disable-next-line default-case
      switch (err.extensions.code) {
        case 'UNAUTHENTICATED':
          const headers = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...headers,
              authorization: localStorage.getItem('token'),
            },
          });

          return forward(operation);

        case 'ANOTHER_ERROR_CODE':
          Notification['warning']({
            title: 'Alerta',
            duration: 15000,
            description: 'Alerta, el tiempo de conexión se está agotando, por seguridad guarde sus cambios y vuelva a iniciar sesión'
          })
      }
    }
  }
  if (networkError) {
    Notification['warning']({
      title: 'Alerta',
      duration: 5000,
      description: 'Se ha perdido la conexión con el servidor, recargue la página y siga con sus solicitudes, gracias.'
    })
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([linkError, authLink, uploadLink]),
  cache: new InMemoryCache({
    addTypename: false
  })
});


ReactDOM.render(
  <ApolloProvider client={client}>
    <RootSession />
  </ApolloProvider>,
  document.getElementById('root')
);

serviceWorker.register();

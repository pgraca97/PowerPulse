import { ApolloClient, InMemoryCache, ApolloProvider, split, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { auth } from '../config/firebase';
import PropTypes from 'prop-types';

export function ApolloProviderWrapper({ children }) {
  // HTTP link for regular operations
  const httpLink = createHttpLink({
    uri: 'http://localhost:4001/graphql',
  });

  // Auth link for adding token to requests
  const authLink = setContext(async (_, { headers }) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        }
      };
    } catch (error) {
      console.error('Error getting auth token:', error);
      return { headers };
    }
  });

  // WebSocket link for subscriptions
  const wsLink = new GraphQLWsLink(createClient({
    url: 'ws://localhost:4001/graphql',
    connectionParams: async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        return {
          Authorization: token ? `Bearer ${token}` : '',
        };
      } catch (error) {
        console.error('WebSocket auth error:', error);
        return {};
      }
    },
  }));

  // Split link to route between HTTP and WebSocket
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(httpLink)
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first'
      },
      query: {
        fetchPolicy: 'network-only'
      }
    }
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

ApolloProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
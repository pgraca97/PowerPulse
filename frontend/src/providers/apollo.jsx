// src/providers/apollo.jsx
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { auth } from '../config/firebase';
import PropTypes from 'prop-types';

export function ApolloProviderWrapper({ children }) {
  const httpLink = createHttpLink({
    uri: 'http://localhost:4001/graphql',
  });

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

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

ApolloProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
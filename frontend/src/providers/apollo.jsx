// src/providers/apollo.jsx
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types';

export function ApolloProviderWrapper({ children }) {
  const { getAccessTokenSilently } = useAuth0();

  const httpLink = createHttpLink({
    uri: 'http://localhost:4001/graphql',
  });

  const authLink = setContext(async (_, { headers }) => {
    try {
      const token = await getAccessTokenSilently();
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        }
      };
    } catch (error) {
        console.error('Error setting token:', error);
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
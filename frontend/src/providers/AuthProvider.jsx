import { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { AuthContext } from '../contexts/AuthContext';
import { useApolloClient, useMutation, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Loader } from '@mantine/core';

const SYNC_USER = gql`
  mutation CreateOrUpdateUser($input: CreateOrUpdateUserInput!) {
    createOrUpdateUser(input: $input) {
      id
      firebaseUid
      email
      name
    }
  }
`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apolloClient = useApolloClient();
  const [syncUser] = useMutation(SYNC_USER);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Sincroniza com a MongoDB sempre que houver um usuário autenticado
          await syncUser({
            variables: {
              input: {
                firebaseUid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                picture: firebaseUser.photoURL
              }
            }
          });
        }
        setUser(firebaseUser);
      } catch (error) {
        console.error('Error syncing user:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [syncUser]);

  const logout = async () => {
    try {
      await signOut(auth);
      await apolloClient.clearStore();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  if (loading) {
    return <Loader size="xl" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
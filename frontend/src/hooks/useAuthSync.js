// frontend/src/hooks/useAuthSync.js
import { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from './useAuth';

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

export function useAuthSync() {
  const { user: firebaseUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [syncUser] = useMutation(SYNC_USER);

  useEffect(() => {
    const syncUserData = async () => {
      if (authLoading) return;

      try {
        if (firebaseUser) {
          // Sync with our backend
          await syncUser({
            variables: {
              input: {
                firebaseUid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || '',
                picture: firebaseUser.photoURL || ''
              }
            }
          });
          
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth sync error:', err);
        setError(err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    syncUserData();
  }, [firebaseUser, authLoading, syncUser]);

  return {
    loading: loading || authLoading,
    error,
    isAuthenticated
  };
}
// src/hooks/useAuthSync.js
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { gql, useMutation } from '@apollo/client';

const CREATE_OR_UPDATE_USER = gql`
  mutation CreateOrUpdateUser($input: CreateOrUpdateUserInput!) {
    createOrUpdateUser(input: $input) {
      id
      auth0Id
      email
      name
      picture
      profile {
        height
        weight
        goals
        fitnessLevel
      }
    }
  }
`;

export function useAuthSync() {
  const { user, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const [createOrUpdateUser, { loading: syncLoading, error }] = useMutation(CREATE_OR_UPDATE_USER);

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user && !auth0Loading) {
        try {
          const response = await createOrUpdateUser({
            variables: {
              input: {
                auth0Id: user.sub,
                email: user.email,
                name: user.name,
                picture: user.picture
              }
            }
          });
          
          console.log('User synced with backend:', response.data.createOrUpdateUser);
        } catch (err) {
          console.error('Error syncing user:', err);
        }
      }
    };

    syncUser();
  }, [isAuthenticated, user, auth0Loading, createOrUpdateUser]);

  return {
    isLoading: auth0Loading || syncLoading,
    error,
    isAuthenticated
  };
}
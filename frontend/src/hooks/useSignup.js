import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useMutation, gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateOrUpdateUser($input: CreateOrUpdateUserInput!) {
    createOrUpdateUser(input: $input) {
      id
      firebaseUid
      email
      name
      profile {
        height
        weight
        fitnessLevel
      }
      progress {
        exerciseType {
          id
          title
        }
        level
        points
      }
    }
  }
`;

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [createUser] = useMutation(CREATE_USER);

  const signup = async ({ email, password, name }) => {
    setLoading(true);
    let firebaseUser = null;

    try {
      // 1. Create Firebase user
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = user;

      // 2. Update Firebase profile
      await updateProfile(user, { displayName: name });

      // 3. Create user in MongoDB and wait for it to complete
      const { data } = await createUser({
        variables: {
          input: {
            firebaseUid: user.uid,
            email,
            name,
            picture: user.photoURL || null
          }
        },
        // Important: Wait for the mutation to complete
        awaitRefetchQueries: true
      });

      if (!data?.createOrUpdateUser) {
        throw new Error('Failed to create user in database');
      }

      // Small delay to ensure state propagation
      await new Promise(resolve => setTimeout(resolve, 500));

      return { success: true };
    } catch (error) {
      // Cleanup: delete Firebase user if MongoDB creation fails
      if (firebaseUser) {
        try {
          await deleteUser(firebaseUser);
        } catch (deleteError) {
          console.error('Error cleaning up Firebase user:', deleteError);
        }
      }
      
      console.error('Signup error:', error);

      if (error.code === 'auth/email-already-in-use') {
        return {
          success: false,
          error: 'email',
          message: 'This email is already registered.'
        };
      }
      
      return {
        success: false,
        error: 'general',
        message: error.message || 'An unexpected error occurred.'
      };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
}
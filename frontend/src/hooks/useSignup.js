// src/hooks/useSignup.js
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile, deleteUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useMutation, gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateOrUpdateUser($input: CreateOrUpdateUserInput!) {
    createOrUpdateUser(input: $input) {
      id
      email
      name
      picture {
        url
        publicId
        resourceType
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
      // Step 1: Create Firebase user
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = user;

      // Step 2: Update Firebase profile
      await updateProfile(user, { displayName: name });

      // Step 3: Create user in MongoDB
      try {
        await createUser({
          variables: {
            input: {
              firebaseUid: user.uid,
              email,
              name,
              picture: user.photoURL ? {
                url: user.photoURL,
                publicId: `firebase-${user.uid}`,
                resourceType: 'IMAGE'
              } : null
            }
          }
        });

        return { success: true };
      } catch (mongoError) {
        console.error('Failed to create account in database:', mongoError);
        // If MongoDB creation fails, delete the Firebase user
        if (firebaseUser) {
          await deleteUser(firebaseUser);
        }
        return {
          success: false,
          error: 'database',
          message: 'Failed to create account in database. Please try again.'
        };
      }
    } catch (error) {
      // Handle Firebase specific errors
      if (error.code === 'auth/email-already-in-use') {
        return {
          success: false,
          error: 'email',
          message: 'This email is already registered.'
        };
      }
      
      if (error.code === 'auth/weak-password') {
        return {
          success: false,
          error: 'password',
          message: 'Password is too weak. Please use at least 6 characters.'
        };
      }

      return {
        success: false,
        error: 'general',
        message: 'An unexpected error occurred. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    loading
  };
}
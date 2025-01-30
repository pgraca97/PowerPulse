import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export function useLogin() {
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let errorResponse = {
        success: false,
        error: 'general',
        message: 'Failed to log in. Please check your credentials and try again.'
      };

      // Map Firebase error codes to specific error responses
      switch (error.code) {
        case 'auth/invalid-email':
          errorResponse = {
            success: false,
            error: 'email',
            message: 'Invalid email format'
          };
          break;
        case 'auth/user-not-found':
          errorResponse = {
            success: false,
            error: 'email',
            message: 'No account found with this email'
          };
          break;
        case 'auth/wrong-password':
          errorResponse = {
            success: false,
            error: 'password',
            message: 'Incorrect password'
          };
          break;
        case 'auth/too-many-requests':
          errorResponse = {
            success: false,
            error: 'general',
            message: 'Too many failed attempts. Please try again later.'
          };
          break;
      }

      return errorResponse;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading
  };
}
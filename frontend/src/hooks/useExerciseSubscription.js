// src/hooks/useExerciseSubscription.js
import { useEffect } from 'react';
import { useSubscription, gql } from '@apollo/client';
import { useNotifications } from './useNotifications';

const EXERCISE_ADDED_SUBSCRIPTION = gql`
  subscription OnExerciseAdded {
    exerciseAdded {
      id
      title
      description
      type {
        id
        title
      }
      difficulty
      pointsAwarded
    }
  }
`;

export function useExerciseSubscription() {
  const { refetch } = useNotifications();

  const { data, loading, error } = useSubscription(EXERCISE_ADDED_SUBSCRIPTION, {
    onData: ({ data: { data } }) => {
      console.log('Subscription data received:', data); // Debug log
      if (data?.exerciseAdded) {
        // Recarrega as notificações quando receber nova
        refetch();
      }
    },
    onError: (error) => {
      console.error('Subscription error:', error);
    }
  });

  useEffect(() => {
    if (error) {
      console.error('Exercise subscription error:', error);
    }
  }, [error]);

  return { newExercise: data?.exerciseAdded, loading, error };
}
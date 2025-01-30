import { useEffect } from 'react';
import { useSubscription, gql } from '@apollo/client';
import { useNotifications } from './useNotifications';

const EXERCISE_CREATED_SUBSCRIPTION = gql`
  subscription OnExerciseCreated {
    exerciseCreated {
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

  const { data, loading, error } = useSubscription(EXERCISE_CREATED_SUBSCRIPTION, {
    onData: ({ data: { data } }) => {
      console.log('Subscription data received:', data);
      if (data?.exerciseCreated) {
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

  return { newExercise: data?.exerciseCreated, loading, error };
}
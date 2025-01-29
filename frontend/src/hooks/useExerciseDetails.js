// src/hooks/useExerciseDetails.js - Para detalhes de um exercício
import { useQuery, gql } from '@apollo/client';

const GET_EXERCISE = gql`
  query GetExercise($id: ID!) {
    exercise(id: $id) {
      id
      title
      description
      equipment
      type {
        id
        title
      }
      difficulty
      muscles
      instructions
      pointsAwarded
    }
  }
`;

export function useExerciseDetails(exerciseId) {
  const { data, loading, error, refetch } = useQuery(GET_EXERCISE, {
    variables: { id: exerciseId },
    skip: !exerciseId,
    fetchPolicy: 'cache-and-network'
  });

  return {
    exercise: data?.exercise,
    loading,
    error,
    refetch
  };
}

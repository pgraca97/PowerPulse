import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth } from './useAuth';

const GET_USER_PROGRESS = gql`
  query GetUserProgress {
    me {
      id
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

const COMPLETE_EXERCISE = gql`
  mutation CompleteExercise($exerciseId: ID!) {
    completeExercise(exerciseId: $exerciseId) {
      exerciseType {
        id
        title
      }
      level
      points
    }
  }
`;

export function useProgress() {
  const { user } = useAuth();

  const {
    data,
    loading: progressLoading,
    error: progressError,
    refetch: refetchProgress
  } = useQuery(GET_USER_PROGRESS, {
    skip: !user,
    fetchPolicy: 'network-only'
  });

  const [completeExerciseMutation, { loading: mutationLoading }] = useMutation(COMPLETE_EXERCISE, {
    refetchQueries: [{ query: GET_USER_PROGRESS }]
  });

  const completeExercise = async (exerciseId) => {
    if (!user) {
      throw new Error('Must be authenticated to complete exercises');
    }

    try {
      const { data } = await completeExerciseMutation({
        variables: { exerciseId }
      });

      return data.completeExercise;
    } catch (error) {
      console.error('Error completing exercise:', error);
      throw new Error(
        error.graphQLErrors?.[0]?.message ||
        error.networkError?.result?.errors?.[0]?.message ||
        'Failed to complete exercise'
      );
    }
  };

  return {
    progress: data?.me?.progress || [],
    loading: progressLoading || mutationLoading,
    error: progressError,
    completeExercise,
    refetchProgress
  };
}
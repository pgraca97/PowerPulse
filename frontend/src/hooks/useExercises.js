import { useQuery, gql } from '@apollo/client';

const GET_EXERCISES = gql`
  query GetExercises($filters: ExerciseFilters) {
    exercises(filters: $filters) {
      exercises {
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
      total
      hasMore
    }
  }
`;

export function useExercises(initialFilters = {}) {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_EXERCISES, {
    variables: { filters: initialFilters },
    fetchPolicy: 'cache-and-network'
  });

  const loadMore = async () => {
    if (!data?.exercises.hasMore) return;
    
    await fetchMore({
      variables: {
        filters: {
          ...initialFilters,
          offset: data.exercises.exercises.length
        }
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          exercises: {
            ...fetchMoreResult.exercises,
            exercises: [
              ...prev.exercises.exercises,
              ...fetchMoreResult.exercises.exercises
            ]
          }
        };
      }
    });
  };

  return {
    exercises: data?.exercises.exercises || [],
    total: data?.exercises.total || 0,
    hasMore: data?.exercises.hasMore || false,
    loading,
    error,
    loadMore,
    refetch
  };
}

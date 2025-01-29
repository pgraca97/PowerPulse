import { useQuery, useMutation, gql } from '@apollo/client';

const GET_EXERCISE = gql`
  query GetExercise($id: ID!) {
    exercise(id: $id) {
      id
      title
      description
      type {
        id
        title
      }
      difficulty
      muscles
      instructions
      pointsAwarded
      createdAt
      updatedAt
    }
  }
`;

const GET_EXERCISES = gql`
  query GetExercises($filters: ExerciseFilters) {
    exercises(filters: $filters) {
      id
      title
      description
      type {
        id
        title
      }
      difficulty
      muscles
      instructions
      pointsAwarded
      createdAt
      updatedAt
    }
  }
`;

const CREATE_EXERCISE = gql`
  mutation CreateExercise($input: CreateExerciseInput!) {
    createExercise(input: $input) {
      id
      title
      description
      type {
        id
        title
      }
      difficulty
      muscles
      instructions
      pointsAwarded
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_EXERCISE = gql`
  mutation UpdateExercise($id: ID!, $input: UpdateExerciseInput!) {
    updateExercise(id: $id, input: $input) {
      id
      title
      description
      type {
        id
        title
      }
      difficulty
      muscles
      instructions
      pointsAwarded
      createdAt
      updatedAt
    }
  }
`;

const DELETE_EXERCISE = gql`
  mutation DeleteExercise($id: ID!) {
    deleteExercise(id: $id)
  }
`;

export function useExercise(exerciseId) {
  // Query for a single exercise if ID is provided
  const {
    data: exerciseData,
    loading: exerciseLoading,
    error: exerciseError,
    refetch: refetchExercise
  } = useQuery(GET_EXERCISE, {
    variables: { id: exerciseId },
    skip: !exerciseId,
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('Exercise query error:', error);
    }
  });

  // Query for all exercises with optional filters
  const {
    data: exercisesData,
    loading: exercisesLoading,
    error: exercisesError,
    refetch: refetchExercises
  } = useQuery(GET_EXERCISES, {
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('Exercises query error:', error);
    }
  });

  // Mutations
  const [createExerciseMutation, { loading: createLoading }] = useMutation(CREATE_EXERCISE);
  const [updateExerciseMutation, { loading: updateLoading }] = useMutation(UPDATE_EXERCISE);
  const [deleteExerciseMutation, { loading: deleteLoading }] = useMutation(DELETE_EXERCISE);

  const createExercise = async (exerciseData) => {
    try {
      const { data } = await createExerciseMutation({
        variables: {
          input: exerciseData
        }
      });
      await refetchExercises();
      return data.createExercise;
    } catch (error) {
      console.error('Error in createExercise:', error);
      throw error;
    }
  };

  const updateExercise = async (id, exerciseData) => {
    try {
      const { data } = await updateExerciseMutation({
        variables: {
          id,
          input: exerciseData
        }
      });
      await refetchExercises();
      if (exerciseId) await refetchExercise();
      return data.updateExercise;
    } catch (error) {
      console.error('Error in updateExercise:', error);
      throw error;
    }
  };

  const deleteExercise = async (id) => {
    try {
      const { data } = await deleteExerciseMutation({
        variables: { id }
      });
      await refetchExercises();
      return data.deleteExercise;
    } catch (error) {
      console.error('Error in deleteExercise:', error);
      throw error;
    }
  };

  const getExercises = async (filters = {}) => {
    try {
      const { data } = await refetchExercises({ filters });
      return data.exercises;
    } catch (error) {
      console.error('Error in getExercises:', error);
      throw error;
    }
  };

  return {
    exercise: exerciseData?.exercise,
    exercises: exercisesData?.exercises,
    loading: exerciseLoading || exercisesLoading || createLoading || updateLoading || deleteLoading,
    error: exerciseError || exercisesError,
    createExercise,
    updateExercise,
    deleteExercise,
    getExercises,
    refetchExercise,
    refetchExercises
  };
}
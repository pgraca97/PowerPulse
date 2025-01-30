// src/hooks/useExerciseType.js
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_EXERCISE_TYPE = gql`
  query ExerciseType($id: ID!) {
    exerciseType(id: $id) {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;

const GET_EXERCISE_TYPES = gql`
  query ExerciseTypes {
    exerciseTypes {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;

const CREATE_EXERCISE_TYPE = gql`
  mutation CreateExerciseType($input: CreateExerciseTypeInput!) {
    createExerciseType(input: $input) {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_EXERCISE_TYPE = gql`
  mutation UpdateExerciseType($id: ID!, $input: UpdateExerciseTypeInput!) {
    updateExerciseType(id: $id, input: $input) {
      id
      title
      description
      createdAt
      updatedAt
    }
  }
`;

const DELETE_EXERCISE_TYPE = gql`
  mutation DeleteExerciseType($id: ID!) {
    deleteExerciseType(id: $id)
  }
`;

export function useExerciseType(id) {
  // Query for single exercise type
  const {
    data: typeData,
    loading: typeLoading,
    error: typeError
  } = useQuery(GET_EXERCISE_TYPE, {
    variables: { id },
    skip: !id
  });

  // Query for all exercise types
  const {
    data: typesData,
    loading: typesLoading,
    error: typesError,
    refetch: refetchTypes
  } = useQuery(GET_EXERCISE_TYPES);

  // Mutations
  const [createExerciseType, { loading: createLoading }] = useMutation(CREATE_EXERCISE_TYPE);
  const [updateExerciseType, { loading: updateLoading }] = useMutation(UPDATE_EXERCISE_TYPE);
  const [deleteExerciseType, { loading: deleteLoading }] = useMutation(DELETE_EXERCISE_TYPE);

  const handleCreate = async (input) => {
    try {
      const { data } = await createExerciseType({
        variables: { input },
        refetchQueries: [{ query: GET_EXERCISE_TYPES }]
      });
      return data.createExerciseType;
    } catch (error) {
      console.error('Error creating exercise type:', error);
      throw error;
    }
  };

  const handleUpdate = async (id, input) => {
    try {
      const { data } = await updateExerciseType({
        variables: { id, input },
        refetchQueries: [{ query: GET_EXERCISE_TYPES }]
      });
      return data.updateExerciseType;
    } catch (error) {
      console.error('Error updating exercise type:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await deleteExerciseType({
        variables: { id },
        refetchQueries: [{ query: GET_EXERCISE_TYPES }]
      });
      return data.deleteExerciseType;
    } catch (error) {
      console.error('Error deleting exercise type:', error);
      throw error;
    }
  };

  return {
    exerciseType: typeData?.exerciseType,
    exerciseTypes: typesData?.exerciseTypes || [],
    loading: typeLoading || typesLoading || createLoading || updateLoading || deleteLoading,
    error: typeError || typesError,
    createExerciseType: handleCreate,
    updateExerciseType: handleUpdate,
    deleteExerciseType: handleDelete,
    refetchTypes
  };
}
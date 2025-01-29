// src/hooks/useExerciseType.js
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

// Define the GraphQL queries and mutations
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

export const useExerciseType = () => {
  // Fetch a single exercise type by ID
  const getExerciseType = (id) => {
    const { loading, error, data } = useQuery(GET_EXERCISE_TYPE, {
      variables: { id },
    });
    return { loading, error, exerciseType: data?.exerciseType };
  };

  // Fetch all exercise types
  const getExerciseTypes = () => {
    const { loading, error, data } = useQuery(GET_EXERCISE_TYPES);
    return { loading, error, exerciseTypes: data?.exerciseTypes };
  };

  // Create a new exercise type
  const [createExerciseType] = useMutation(CREATE_EXERCISE_TYPE, {
    refetchQueries: [{ query: GET_EXERCISE_TYPES }],
  });

  // Update an existing exercise type
  const [updateExerciseType] = useMutation(UPDATE_EXERCISE_TYPE, {
    refetchQueries: [{ query: GET_EXERCISE_TYPES }],
  });

  // Delete an exercise type
  const [deleteExerciseType] = useMutation(DELETE_EXERCISE_TYPE, {
    refetchQueries: [{ query: GET_EXERCISE_TYPES }],
  });

  return {
    getExerciseType,
    getExerciseTypes,
    createExerciseType,
    updateExerciseType,
    deleteExerciseType,
  };
};
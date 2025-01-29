// src/hooks/useExerciseAdmin.js - Para operações administrativas
import { useMutation, gql } from '@apollo/client';

const CREATE_EXERCISE = gql`
  mutation CreateExercise($input: CreateExerciseInput!) {
    createExercise(input: $input) {
      id
      title
    }
  }
`;

const UPDATE_EXERCISE = gql`
  mutation UpdateExercise($id: ID!, $input: UpdateExerciseInput!) {
    updateExercise(id: $id, input: $input) {
      id
      title
    }
  }
`;

const DELETE_EXERCISE = gql`
  mutation DeleteExercise($id: ID!) {
    deleteExercise(id: $id)
  }
`;

export function useExerciseAdmin() {
  const [createExercise, { loading: createLoading }] = useMutation(CREATE_EXERCISE);
  const [updateExercise, { loading: updateLoading }] = useMutation(UPDATE_EXERCISE);
  const [deleteExercise, { loading: deleteLoading }] = useMutation(DELETE_EXERCISE);

  return {
    createExercise: async (input) => {
      const { data } = await createExercise({ variables: { input } });
      return data.createExercise;
    },
    updateExercise: async (id, input) => {
      const { data } = await updateExercise({ variables: { id, input } });
      return data.updateExercise;
    },
    deleteExercise: async (id) => {
      const { data } = await deleteExercise({ variables: { id } });
      return data.deleteExercise;
    },
    loading: createLoading || updateLoading || deleteLoading
  };
}
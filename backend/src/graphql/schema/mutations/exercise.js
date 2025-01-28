// src/graphql/schema/mutations/exercise.js
export const exerciseMutations = `
  type Mutation {
    createExercise(input: CreateExerciseInput!): Exercise!
    updateExercise(id: ID!, input: UpdateExerciseInput!): Exercise!
    deleteExercise(id: ID!): Boolean!
  }
`;

// src/graphql/schema/mutations/exerciseType.js
export const exerciseTypeMutations = `
  type Mutation {
    createExerciseType(input: CreateExerciseTypeInput!): ExerciseType!
    updateExerciseType(id: ID!, input: UpdateExerciseTypeInput!): ExerciseType!
    deleteExerciseType(id: ID!): Boolean!
  }
`;

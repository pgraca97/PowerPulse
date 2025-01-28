// src/graphql/schema/types/exerciseType.js
export const exerciseTypeTypes = `
  type ExerciseType {
    id: ID!
    title: String!
    description: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateExerciseTypeInput {
    title: String!
    description: String
  }

  input UpdateExerciseTypeInput {
    title: String
    description: String
  }
`;

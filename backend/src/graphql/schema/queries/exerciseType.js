// src/graphql/schema/queries/exerciseType.js
export const exerciseTypeQueries = `
  type Query {
    exerciseType(id: ID!): ExerciseType
    exerciseTypes: [ExerciseType!]!
  }
`;

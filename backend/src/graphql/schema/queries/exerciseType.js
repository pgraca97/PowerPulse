
export const exerciseTypeQueries = `
  type Query {
    exerciseType(id: ID!): ExerciseType
    exerciseTypes: [ExerciseType!]!
  }
`;


export const exerciseQueries = `
  type Query {
    exercise(id: ID!): Exercise
    exercises(filters: ExerciseFilters): ExerciseResponse!
  }
`;

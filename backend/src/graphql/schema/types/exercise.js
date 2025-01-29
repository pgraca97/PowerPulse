// src/graphql/schema/types/exercise.js
export const exerciseTypes = `
  type Exercise {
    id: ID!
    title: String!
    description: String!
    equipment: String!
    type: ExerciseType!
    difficulty: Difficulty!
    muscles: [Muscle!]!
    instructions: [String!]!
    pointsAwarded: Int!
    createdAt: String!
    updatedAt: String!
  }

  type PaginatedExercises {  
    exercises: [Exercise!]!
    totalCount: Int!
  }
`;

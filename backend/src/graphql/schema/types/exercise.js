// src/graphql/schema/types/exercise.js
export const exerciseTypes = `
  type Exercise {
    id: ID!
    title: String!
    description: String!
    type: ExerciseType!
    difficulty: Difficulty!
    muscles: [Muscle!]!
    instructions: [String!]!
    pointsAwarded: Int!
    createdAt: String!
    updatedAt: String!
  }

  enum Difficulty {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  enum Muscle {
    CHEST
    BACK
    SHOULDERS
    BICEPS
    TRICEPS
    LEGS
    CORE
    FULL_BODY
  }

  input CreateExerciseInput {
    title: String!
    description: String!
    typeId: ID!
    difficulty: Difficulty!
    muscles: [Muscle!]!
    instructions: [String!]!
    pointsAwarded: Int!
  }

  input UpdateExerciseInput {
    title: String
    description: String
    typeId: ID
    difficulty: Difficulty
    muscles: [Muscle!]
    instructions: [String!]
    pointsAwarded: Int
  }

  input ExerciseFilters {
    typeId: ID
    difficulty: Difficulty
    muscle: Muscle
  }
`;

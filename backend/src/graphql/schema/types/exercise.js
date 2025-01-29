// src/graphql/schema/types/exercise.js
import { DIFFICULTY_LEVELS, MUSCLE_GROUPS } from "../../../constants/exercise.js";

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

  enum Difficulty {
 ${DIFFICULTY_LEVELS.join('\n    ')}
  }

  enum Muscle {
${MUSCLE_GROUPS.join('\n    ')}
  }

  input CreateExerciseInput {
    title: String!
    description: String!
    typeId: ID!
    difficulty: Difficulty!
    muscles: [Muscle!]!
    instructions: [String!]!
    equipment: String
    pointsAwarded: Int!
  }

  input UpdateExerciseInput {
    title: String
    description: String
    typeId: ID
    difficulty: Difficulty
    muscles: [Muscle!]
    instructions: [String!]
    equipment: String
    pointsAwarded: Int
  }

  input ExerciseFilters {
  search: String
    typeId: ID
    difficulty: Difficulty
    muscle: Muscle
    limit: Int
    offset: Int
  }

  type ExerciseResponse {
    exercises: [Exercise!]!
    total: Int!
    hasMore: Boolean!
  }
`;

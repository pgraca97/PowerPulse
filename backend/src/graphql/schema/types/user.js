
import { DIFFICULTY_LEVELS } from "../../../constants/exercise.js";

export const userTypes = `
  type User {
    id: ID!
    firebaseUid: String!
    email: String!
    name: String
    isAdmin: Boolean!
    picture: Media
    profile: Profile
    progress: [UserProgress!]!
    createdAt: String!
    updatedAt: String!
  }

  type Profile {
    height: Float
    weight: Float
    goals: [String]
    fitnessLevel: FitnessLevel
    bio: String
  }

  input ProfileInput {
    height: Float
    weight: Float
    goals: [String]
    fitnessLevel: FitnessLevel
    bio: String
  }

  input CreateOrUpdateUserInput {
    firebaseUid: String!
    email: String!
    name: String
    picture: String
  }

  input UpdateProfileInput {
    name: String
    profile: ProfileInput
  }

  type Media {
    url: String
    publicId: String
    resourceType: MediaType
  }

  enum MediaType {
    IMAGE
    VIDEO
  }

  enum FitnessLevel {
 ${DIFFICULTY_LEVELS.join('\n    ')}
  }

  type UserProgress {
  exerciseType: ExerciseType!
  level: Int!
  points: Int!
  }

  type ExerciseType {
    id: ID!
    title: String!
    description: String
  }
`;

// src/graphql/schema/types/user.js
export const userTypes = `
  type User {
    id: ID!
    auth0Id: String!
    email: String!
    name: String
    picture: String
    profile: Profile
    createdAt: String!
    updatedAt: String!
  }

  type Profile {
    height: Float
    weight: Float
    goals: [String]
    fitnessLevel: FitnessLevel
  }

  enum FitnessLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  input ProfileInput {
    height: Float
    weight: Float
    goals: [String]
    fitnessLevel: FitnessLevel
  }

  input UpdateUserInput {
    name: String
    picture: String
    profile: ProfileInput
  }
`;
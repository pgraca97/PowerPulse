// backend/src/graphql/schema/mutations/user.js
export const userMutations = `
  type Mutation {
    createOrUpdateUser(input: CreateOrUpdateUserInput!): User!
    updateProfile(input: UpdateProfileInput!): User!
    getSignedUploadUrl: SignedUploadResponse!
    deleteUser: Boolean!
    completeExercise(exerciseId: ID!): UserProgress
  }

  type SignedUploadResponse {
    signature: String!
    timestamp: Int!
    apiKey: String!
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
    pictureUrl: String
  }

  type UserProgress {
    exerciseType: ExerciseType!
    level: Int!
    points: Int!
  }
`;

// backend/src/graphql/schema/mutations/user.js
export const userMutations = `
  type Mutation {
    createOrUpdateUser(input: CreateOrUpdateUserInput!): User!
    updateProfile(input: UpdateProfileInput!): User!
    uploadProfilePicture(file: Upload!): Media!
    deleteUser: Boolean!
  }

  input CreateOrUpdateUserInput {
    firebaseUid: String!
    email: String!
    name: String
    picture: String
  }

  input UpdateProfileInput {
    username: String
    name: String
    profile: ProfileInput
  }

  scalar Upload
`;
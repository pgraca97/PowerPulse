// src/graphql/schema/mutations/user.js
export const userMutations = `
  type Mutation {
  createOrUpdateUser(input: CreateOrUpdateUserInput!): User!
    updateUser(input: UpdateUserInput!): User!
    deleteUser: Boolean!
  }

    input CreateOrUpdateUserInput {
    auth0Id: String!
    email: String!
    name: String
    picture: String
}
`;
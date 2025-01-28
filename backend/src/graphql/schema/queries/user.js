// src/graphql/schema/queries/user.js
export const userQueries = `
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]!
  }
`;

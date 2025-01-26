// src/graphql/resolvers/index.js
import { userResolvers } from './user.js';

export const resolvers = {
  Query: {
    ...userResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation
  }
};
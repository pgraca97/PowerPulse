// backend/src/graphql/resolvers/index.js
import { userResolvers } from "./user.js";
import { exerciseResolvers } from "./exercise.js";
import { exerciseTypeResolvers } from "./exerciseType.js";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...exerciseResolvers.Query,
    ...exerciseTypeResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...exerciseResolvers.Mutation,
    ...exerciseTypeResolvers.Mutation,
  },
  Subscription: {
    ...exerciseResolvers.Subscription,
  },
  UserProgress: userResolvers.UserProgress,
};
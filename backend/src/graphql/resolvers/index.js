
import { userResolvers } from "./user.js";
import { exerciseResolvers } from "./exercise.js";
import { exerciseTypeResolvers } from "./exerciseType.js";
import { notificationResolvers } from "./notification.js";
export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...exerciseResolvers.Query,
    ...exerciseTypeResolvers.Query,
    ...notificationResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...exerciseResolvers.Mutation,
    ...exerciseTypeResolvers.Mutation,
    ...notificationResolvers.Mutation,
  },
  Subscription: {
    ...exerciseResolvers.Subscription,
  },
  UserProgress: userResolvers.UserProgress,
};
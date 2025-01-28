// src/graphql/resolvers/exerciseType.js
import { ExerciseType } from "../../models/ExerciseType.js";

export const exerciseTypeResolvers = {
  Query: {
    exerciseType: async (_, { id }) => {
      return await ExerciseType.findById(id);
    },
    exerciseTypes: async () => {
      return await ExerciseType.find({});
    },
  },

  Mutation: {
    createExerciseType: async (_, { input }) => {
      return await ExerciseType.create(input);
    },
    updateExerciseType: async (_, { id, input }) => {
      return await ExerciseType.findByIdAndUpdate(id, input, { new: true });
    },
    deleteExerciseType: async (_, { id }) => {
      await ExerciseType.findByIdAndDelete(id);
      return true;
    },
  },
};

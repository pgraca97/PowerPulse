// src/graphql/resolvers/exercise.js
import { Exercise } from "../../models/Exercise.js";
import { User } from "../../models/User.js";

export const exerciseResolvers = {
  Query: {
    exercise: async (_, { id }) => {
      return await Exercise.findById(id).populate("type");
    },
    exercises: async (_, { filters = {} }) => {
      const query = {};

      if (filters.typeId) query.type = filters.typeId;
      if (filters.difficulty) query.difficulty = filters.difficulty;
      if (filters.muscle) query.muscles = filters.muscle;

      return await Exercise.find(query).populate("type");
    },
  },

  Mutation: {
    createExercise: async (_, { input }) => {
      const exercise = await Exercise.create(input);
      return await exercise.populate("type");
    },
    updateExercise: async (_, { id, input }) => {
      const exercise = await Exercise.findByIdAndUpdate(id, input, {
        new: true,
      });
      return await exercise.populate("type");
    },
    deleteExercise: async (_, { id }) => {
      await Exercise.findByIdAndDelete(id);
      return true;
    },
  },

  Exercise: {
    type: async (exercise) => {
      return await ExerciseType.findById(exercise.type);
    },
  },
};

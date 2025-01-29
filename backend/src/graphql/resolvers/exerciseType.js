// src/graphql/resolvers/exerciseType.js
import { ExerciseType } from "../../models/ExerciseType.js";
import { Exercise } from "../../models/Exercise.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import { 
  ValidationError, 
  NotFoundError, 
  handleMongoError,
  validateObjectId,
  validateRequiredFields 
} from "../../middleware/validation.js";

export const exerciseTypeResolvers = {
  Query: {
    exerciseType: async (_, { id }, context) => {
      requireAuth(context);
      validateObjectId(id, 'exerciseType');

      const exerciseType = await ExerciseType.findById(id);
      if (!exerciseType) {
        throw new NotFoundError('ExerciseType', id);
      }
      return exerciseType;
    },
    
    exerciseTypes: async (_, __, context) => {
      requireAuth(context);
      try {
        return await ExerciseType.find({}).sort({ title: 1 });
      } catch (error) {
        throw new Error('Failed to fetch exercise types');
      }
    },
  },

  Mutation: {
    createExerciseType: async (_, { input }, context) => {
      requireAdmin(context);
      
      try {
        // validate required fields
        validateRequiredFields(input, ['title', 'description']);

        // validate title length
        if (input.title.length < 3) {
          throw new ValidationError('Title must be at least 3 characters long');
        }

        // verificar if there is already an exercise type with the same title
        const existingType = await ExerciseType.findOne({ 
          title: input.title.trim() 
        });
        
        if (existingType) {
          throw new ValidationError(
            `ExerciseType with title "${input.title}" already exists`,
            { title: 'Must be unique' }
          );
        }

        return await ExerciseType.create({
          ...input,
          title: input.title.trim()
        });
      } catch (error) {
        return handleMongoError(error);
      }
    },

    updateExerciseType: async (_, { id, input }, context) => {
      requireAdmin(context);
      validateObjectId(id, 'exerciseType');

      try {
        const exerciseType = await ExerciseType.findById(id);
        if (!exerciseType) {
          throw new NotFoundError('ExerciseType', id);
        }

        // if title is in the input, validate it
        if (input.title) {
          if (input.title.length < 3) {
            throw new ValidationError('Title must be at least 3 characters long');
          }

            // Check for duplication, excluding the current one
          const existingType = await ExerciseType.findOne({
            title: input.title.trim(),
            _id: { $ne: id }
          });

          if (existingType) {
            throw new ValidationError(
              `ExerciseType with title "${input.title}" already exists`,
              { title: 'Must be unique' }
            );
          }
        }

        const updatedType = await ExerciseType.findByIdAndUpdate(
          id,
          { ...input, title: input.title?.trim() },
          { new: true, runValidators: true }
        );

        return updatedType;
      } catch (error) {
        return handleMongoError(error);
      }
    },

    deleteExerciseType: async (_, { id }, context) => {
      requireAdmin(context);
      validateObjectId(id, 'exerciseType');

      try {
        const exerciseType = await ExerciseType.findById(id);
        if (!exerciseType) {
          throw new NotFoundError('ExerciseType', id);
        }

        // check if there are exercises using this type
        const exercisesUsingType = await Exercise.exists({ type: id });
        if (exercisesUsingType) {
          throw new ValidationError(
            'Cannot delete exercise type that is being used by exercises',
            { dependencies: 'Has associated exercises' }
          );
        }

        await ExerciseType.findByIdAndDelete(id);
        return true;
      } catch (error) {
        return handleMongoError(error);
      }
    },
  },
};
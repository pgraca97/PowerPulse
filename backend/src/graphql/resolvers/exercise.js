// src/graphql/resolvers/exercise.js
import { Exercise } from "../../models/Exercise.js";
import { ExerciseType } from "../../models/ExerciseType.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import { 
  ValidationError, 
  NotFoundError, 
  handleMongoError,
  validateObjectId,
  validateRequiredFields 
} from "../../middleware/validation.js";
import { DIFFICULTY_LEVELS, MUSCLE_GROUPS } from "../../constants/exercise.js";


export const exerciseResolvers = {
  Query: {
    exercise: async (_, { id }, context) => {
      requireAuth(context);
      validateObjectId(id, 'exercise');

      const exercise = await Exercise.findById(id).populate("type");
      if (!exercise) {
        throw new NotFoundError('Exercise', id);
      }
      return exercise;
    },

    exercises: async (_, { filters = {} }, context) => {
      requireAuth(context);
      const query = {};

      try {
        if (filters.typeId) {
          validateObjectId(filters.typeId, 'typeId');
          const typeExists = await ExerciseType.exists({ _id: filters.typeId });
          if (!typeExists) {
            throw new NotFoundError('ExerciseType', filters.typeId);
          }
          query.type = filters.typeId;
        }

        if (filters.difficulty) {
          if (!DIFFICULTY_LEVELS.includes(filters.difficulty)) {
            throw new ValidationError(
              'Invalid difficulty level',
              { difficulty: `Must be one of: ${DIFFICULTY_LEVELS.join(', ')}` } 
            );
          }
          query.difficulty = filters.difficulty;
        }

        if (filters.muscle) {

          if (!MUSCLE_GROUPS.includes(filters.muscle)) {
            throw new ValidationError(
              'Invalid muscle group',
              { muscle: `Must be one of: ${MUSCLE_GROUPS.join(', ')}` }
            );
          }
          query.muscles = filters.muscle;
        }

        return await Exercise.find(query)
          .populate("type")
          .sort({ title: 1 });
      } catch (error) {
        return handleMongoError(error);
      }
    },
  },

  Mutation: {
    createExercise: async (_, { input }, context) => {
      requireAdmin(context);

      try {
        // Validate required fields
        validateRequiredFields(input, [
          'title',
          'description',
          'typeId',
          'difficulty',
          'muscles',
          'instructions'
        ]);

        // Validate title length
        if (input.title.length < 3) {
          throw new ValidationError('Title must be at least 3 characters long');
        }

        // Validate unique titlre
        const existingExercise = await Exercise.findOne({ 
          title: input.title.trim() 
        });
        
        if (existingExercise) {
          throw new ValidationError(
            `Exercise with title "${input.title}" already exists`,
            { title: 'Must be unique' }
          );
        }

        // Validate typeId
        validateObjectId(input.typeId, 'typeId');
        const exerciseType = await ExerciseType.findById(input.typeId);
        if (!exerciseType) {
          throw new NotFoundError('ExerciseType', input.typeId);
        }

        // Validate difficulty
        if (!DIFFICULTY_LEVELS.includes(input.difficulty)) {
          throw new ValidationError(
            'Invalid difficulty level',
            { difficulty: `Must be one of: ${DIFFICULTY_LEVELS.join(', ')}` }
          );
        }

        
        input.muscles.forEach(muscle => {
          if (!MUSCLE_GROUPS.includes(muscle)) {
            throw new ValidationError(
              'Invalid muscle group',
              { muscles: `Must be one of: ${MUSCLE_GROUPS.join(', ')}` }
            );
          }
        });
        // Validate instructions
        if (!Array.isArray(input.instructions) || input.instructions.length === 0) {
          throw new ValidationError(
            'Instructions must be a non-empty array',
            { instructions: 'At least one instruction is required' }
          );
        }

        const exerciseInput = {
          ...input,
          title: input.title.trim(),
          type: input.typeId,
          pointsAwarded: input.pointsAwarded || 10 // Default points if not provided
        };
        
        const exercise = await Exercise.create(exerciseInput);
        return await exercise.populate("type");
      } catch (error) {
        return handleMongoError(error);
      }
    },

    updateExercise: async (_, { id, input }, context) => {
      requireAdmin(context);
      validateObjectId(id, 'exercise');

      try {
        const exercise = await Exercise.findById(id);
        if (!exercise) {
          throw new NotFoundError('Exercise', id);
        }

        const updates = { ...input };

        // validate title if provided
        if (input.title) {
          if (input.title.length < 3) {
            throw new ValidationError('Title must be at least 3 characters long');
          }

          const existingExercise = await Exercise.findOne({
            title: input.title.trim(),
            _id: { $ne: id }
          });

          if (existingExercise) {
            throw new ValidationError(
              `Exercise with title "${input.title}" already exists`,
              { title: 'Must be unique' }
            );
          }

          updates.title = input.title.trim();
        }

        // validate typeId if provided
        if (input.typeId) {
          validateObjectId(input.typeId, 'typeId');
          const typeExists = await ExerciseType.exists({ _id: input.typeId });
          if (!typeExists) {
            throw new NotFoundError('ExerciseType', input.typeId);
          }
          updates.type = input.typeId;
        }

        // validate difficulty if provided
        if (input.difficulty) {
          if (!DIFFICULTY_LEVELS.includes(input.difficulty)) {
            throw new ValidationError(
              'Invalid difficulty level',
              { difficulty: `Must be one of: ${DIFFICULTY_LEVELS.join(', ')}` }
            );
          }
        }

        // validate muscles if provided
        if (input.muscles) {

          input.muscles.forEach(muscle => {
            if (!MUSCLE_GROUPS.includes(muscle)) {
              throw new ValidationError(
                'Invalid muscle group',
                { muscles: `Must be one of: ${MUSCLE_GROUPS.join(', ')}` }
              );
            }
          });
        }

        // validate instructions if provided
        if (input.instructions) {
          if (!Array.isArray(input.instructions) || input.instructions.length === 0) {
            throw new ValidationError(
              'Instructions must be a non-empty array',
              { instructions: 'At least one instruction is required' }
            );
          }
        }

        const updatedExercise = await Exercise.findByIdAndUpdate(
          id,
          updates,
          { new: true, runValidators: true }
        );

        return await updatedExercise.populate("type");
      } catch (error) {
        return handleMongoError(error);
      }
    },

    deleteExercise: async (_, { id }, context) => {
      requireAdmin(context);
      validateObjectId(id, 'exercise');
      
      try {
        const exercise = await Exercise.findById(id);
        if (!exercise) {
          throw new NotFoundError('Exercise', id);
        }
        
        // Additional validations could be added here in the future
        // For example, checking if the exercise is associated with any workout plans etc
        
        await Exercise.findByIdAndDelete(id);
        return true;
      } catch (error) {
        return handleMongoError(error);
      }
    },
  },

  Exercise: {
    type: async (exercise) => {
      try {
        const type = await ExerciseType.findById(exercise.type);
        if (!type) {
          throw new NotFoundError('ExerciseType', exercise.type);
        }
        return type;
      } catch (error) {
        console.error('Error resolving exercise type:', error);
        throw new Error('Failed to resolve exercise type');
      }
    },
  },
};
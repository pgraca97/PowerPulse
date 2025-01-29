// src/graphql/resolvers/user.js
import { v2 as cloudinary } from "cloudinary";
import { User } from "../../models/User.js";
import { Exercise } from "../../models/Exercise.js";
import { ExerciseType } from "../../models/ExerciseType.js";
import { requireAuth, requireAdmin } from "../../middleware/auth.js";
import { BaseError } from "../../middleware/errors.js";
import {
  ValidationError,
  NotFoundError,
  handleMongoError,
  validateObjectId,
  validateRequiredFields,
} from "../../middleware/validation.js";

export const userResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      requireAuth({ user });
      try {
        const dbUser = await User.findOne({ firebaseUid: user.uid });
        if (!dbUser) throw new NotFoundError("User", user.uid);

        // Ensure progress array exists and has valid data
        if (!dbUser.progress) {
          dbUser.progress = [];
        }

        return dbUser;
      } catch (error) {
        return handleMongoError(error);
      }
    },

    // Admin endpoint: List all users
    users: async (_, __, context) => {
      requireAdmin(context);
      try {
        return await User.find({}).sort({ createdAt: -1 });
      } catch (error) {
        return handleMongoError(error);
      }
    },
  },

  UserProgress: {
    exerciseType: async (progress) => {
      try {
        if (!progress.exerciseTypeId) {
          throw new Error("Exercise type ID is missing from progress");
        }

        const exerciseType = await ExerciseType.findById(
          progress.exerciseTypeId
        );

        if (!exerciseType) {
          throw new Error(
            `ExerciseType not found for id: ${progress.exerciseTypeId}`
          );
        }
        return exerciseType;
      } catch (error) {
        console.error("Error in UserProgress.exerciseType resolver:", error);
        throw error;
      }
    },
  },
  Mutation: {
    // Firebase auth user creation/update
    createOrUpdateUser: async (_, { input }) => {
      try {
        validateRequiredFields(input, ["firebaseUid", "email"]);

        if (!input.email.includes("@")) {
          throw new ValidationError("Invalid email format");
        }

        const updateData = {
          email: input.email,
          name: input.name,
          ...(input.picture && {
            picture: {
              url: input.picture,
              publicId: `firebase-${input.firebaseUid}`,
              resourceType: "IMAGE",
            },
          }),
        };

        return await User.findOneAndUpdate(
          { firebaseUid: input.firebaseUid },
          { $set: updateData },
          { new: true, upsert: true, runValidators: true }
        );
      } catch (error) {
        return handleMongoError(error);
      }
    },

    // Generate Cloudinary upload signature
    getSignedUploadUrl: async (_, __, { user }) => {
      requireAuth({ user });

      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = cloudinary.utils.api_sign_request(
        {
          timestamp,
          folder: "powerpulse/profile-pictures",
          transformation: "c_limit,w_500,h_500,f_auto",
        },
        process.env.CLOUDINARY_API_SECRET
      );

      return {
        signature,
        timestamp,
        apiKey: process.env.CLOUDINARY_API_KEY,
      };
    },

    // Update user profile data
    updateProfile: async (_, { input }, { user }) => {
      requireAuth({ user });

      try {
        const updateData = {};

        if (input.name) {
          if (input.name.length < 2) {
            throw new ValidationError("Name must be at least 2 characters");
          }
          updateData.name = input.name.trim();
        }

        if (input.profile) {
          // Validate profile measurements
          if (
            input.profile.height &&
            (input.profile.height < 0 || input.profile.height > 300)
          ) {
            throw new ValidationError("Invalid height value");
          }
          if (
            input.profile.weight &&
            (input.profile.weight < 0 || input.profile.weight > 500)
          ) {
            throw new ValidationError("Invalid weight value");
          }
          updateData.profile = input.profile;
        }

        if (input.pictureUrl) {
          updateData.picture = {
            url: input.pictureUrl,
            publicId: `powerpulse/profile-pictures/${user.uid}`,
            resourceType: "IMAGE",
          };
        }

        const updatedUser = await User.findOneAndUpdate(
          { firebaseUid: user.uid },
          { $set: updateData },
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          throw new NotFoundError("User", user.uid);
        }

        return updatedUser;
      } catch (error) {
        return handleMongoError(error);
      }
    },

    // Delete user account
    deleteUser: async (_, __, { user }) => {
      requireAuth({ user });
      try {
        const dbUser = await User.findOne({ firebaseUid: user.uid });
        if (!dbUser) throw new NotFoundError("User", user.uid);

        await User.findByIdAndDelete(dbUser._id);
        return true;
      } catch (error) {
        return handleMongoError(error);
      }
    },

    // Track exercise completion and user progress
    completeExercise: async (_, { exerciseId }, { user }) => {
      requireAuth({ user });

      try {
        validateObjectId(exerciseId, "exercise");

        const exercise = await Exercise.findById(exerciseId).populate("type");
        if (!exercise) {
          throw new NotFoundError("Exercise", exerciseId);
        }

        if (!exercise.type) {
          throw new NotFoundError("ExerciseType", "unknown");
        }

        const dbUser = await User.findOne({ firebaseUid: user.uid });
        if (!dbUser) {
          throw new NotFoundError("User", user.uid);
        }

        let progressIndex = dbUser.progress.findIndex(
          (p) => p.exerciseTypeId.toString() === exercise.type._id.toString()
        );

        if (progressIndex === -1) {
          dbUser.progress.push({
            exerciseTypeId: exercise.type._id,
            level: 0,
            points: exercise.pointsAwarded,
          });
          progressIndex = dbUser.progress.length - 1;
        } else {
          dbUser.progress[progressIndex].points += exercise.pointsAwarded;
        }

        // Calculate new level and reset points
        let currentProgress = dbUser.progress[progressIndex];
        const oldLevel = currentProgress.level;
        const newLevel = Math.floor(currentProgress.points / 100);

        if (newLevel > oldLevel) {
          // If leveled up, keep only the excess points
          currentProgress.level = newLevel;
          currentProgress.points = currentProgress.points % 100;

          // Here we could trigger a level up event
          // TODO: Implement subscription for level up
        }

        await dbUser.save();

        return {
          exerciseTypeId: exercise.type._id,
          level: currentProgress.level,
          points: currentProgress.points,
        };
      } catch (error) {
        console.error("Error in completeExercise:", error);
        if (error instanceof BaseError) {
          throw error;
        }
        throw new Error(`Failed to complete exercise: ${error.message}`);
      }
    },
  },
};

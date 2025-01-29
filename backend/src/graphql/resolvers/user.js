// backend/src/graphql/resolvers/user.js
import { v2 as cloudinary } from "cloudinary";
import { User } from "../../models/User.js";

export const userResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await User.findOne({ firebaseUid: user.uid });
    },
    users: async () => {
      try {
        const users = await User.find({});
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
  },

  Mutation: {
    createOrUpdateUser: async (_, { input }) => {
      const { firebaseUid, email, name, picture } = input;

      try {
        // Check if user exists
        let user = await User.findOne({ firebaseUid });

        if (user) {
          // Update existing user
          user = await User.findOneAndUpdate(
            { firebaseUid },
            {
              $set: {
                email,
                name,
                picture: picture
                  ? {
                      url: picture,
                      publicId: `firebase-${firebaseUid}`,
                      resourceType: "IMAGE",
                    }
                  : undefined,
              },
            },
            { new: true }
          );
        } else {
          // Create new user
          user = await User.create({
            firebaseUid,
            email,
            name,
            picture: picture
              ? {
                  url: picture,
                  publicId: `firebase-${firebaseUid}`,
                  resourceType: "IMAGE",
                }
              : undefined,
          });
        }

        return user;
      } catch (error) {
        console.error("Error in createOrUpdateUser:", error);
        throw new Error("Failed to create or update user");
      }
    },

    getSignedUploadUrl: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");

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

    updateProfile: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      try {
        const updateData = {};
        if (input.name) updateData.name = input.name;
        if (input.profile) updateData.profile = input.profile;
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
          { new: true }
        );

        if (!updatedUser) {
          throw new Error("User not found");
        }

        return updatedUser;
      } catch (error) {
        console.error("Error updating profile:", error);
        throw new Error("Failed to update profile");
      }
    },

    deleteUser: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      try {
        const dbUser = await User.findOne({ firebaseUid: user.uid });
        if (!dbUser) throw new Error("User not found");

        /*         // Delete profile picture if exists
        if (dbUser.picture?.publicId) {
          await deleteFromCloudinary(dbUser.picture.publicId);
        } */

        await User.findByIdAndDelete(dbUser._id);
        return true;
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
      }
    },
    
    completeExercise: async (_, { exerciseId }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      try {
        const exercise = await Exercise.findById(exerciseId).populate("type");
        if (!exercise) throw new Error("Exercise not found");

        const dbUser = await User.findOne({ firebaseUid: user.uid });
        if (!dbUser) throw new Error("User not found");

        // Find or create progress for this exercise type
        let progress = dbUser.progress.find(
          (p) => p.exerciseType.toString() === exercise.type._id.toString()
        );

        if (!progress) {
          progress = {
            exerciseType: exercise.type._id,
            level: 0,
            points: 0,
          };
          dbUser.progress.push(progress);
        }

        // Add points
        progress.points += exercise.pointsAwarded;

        // Check for level up (every 100 points)
        const newLevel = Math.floor(progress.points / 100);
        if (newLevel > progress.level) {
          progress.level = newLevel;
        }

        await dbUser.save();

        return progress;
      } catch (error) {
        console.error("Error completing exercise:", error);
        throw new Error("Failed to complete exercise");
      }
    },
  },
};

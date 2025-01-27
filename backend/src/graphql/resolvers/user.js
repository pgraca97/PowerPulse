// backend/src/graphql/resolvers/user.js
import { User } from '../../models/User.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../../services/cloudinaryService.js';

export const userResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      // Using uid from Firebase decoded token
      return await User.findOne({ firebaseUid: user.uid });
    }
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
                picture: picture ? {
                  url: picture,
                  publicId: `firebase-${firebaseUid}`,
                  resourceType: 'IMAGE'
                } : undefined
              }
            },
            { new: true }
          );
        } else {
          // Create new user
          user = await User.create({
            firebaseUid,
            email,
            name,
            picture: picture ? {
              url: picture,
              publicId: `firebase-${firebaseUid}`,
              resourceType: 'IMAGE'
            } : undefined
          });
        }
        
        return user;
      } catch (error) {
        console.error('Error in createOrUpdateUser:', error);
        throw new Error('Failed to create or update user');
      }
    },
    
    updateProfile: async (_, { input }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      
      try {
        const updatedUser = await User.findOneAndUpdate(
          { firebaseUid: user.uid },
          { $set: input },
          { new: true }
        );
        
        if (!updatedUser) {
          throw new Error('User not found');
        }
        
        return updatedUser;
      } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile');
      }
    },
    
    uploadProfilePicture: async (_, { file }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      
      try {
        const dbUser = await User.findOne({ firebaseUid: user.uid });
        if (!dbUser) throw new Error('User not found');
        
        // Delete old profile picture if exists
        if (dbUser.picture?.publicId) {
          await deleteFromCloudinary(dbUser.picture.publicId);
        }
        
        // Upload new image to Cloudinary
        const media = await uploadToCloudinary(file, 'profile-pictures');
        
        // Update user in database
        await User.findOneAndUpdate(
          { firebaseUid: user.uid },
          { $set: { picture: media } }
        );
        
        return media;
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        throw new Error('Failed to upload profile picture');
      }
    },
    deleteUser: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      try {
        const dbUser = await User.findOne({ firebaseUid: user.uid });
        if (!dbUser) throw new Error('User not found');
        
        // Delete profile picture if exists
        if (dbUser.picture?.publicId) {
          await deleteFromCloudinary(dbUser.picture.publicId);
        }
        
        await User.findByIdAndDelete(dbUser._id);
        return true;
      } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
      }
    }
  }
};
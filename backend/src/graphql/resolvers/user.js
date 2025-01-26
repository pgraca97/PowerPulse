// src/graphql/resolvers/user.js
import { User } from '../../models/User.js';

export const userResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const dbUser = await User.findOne({ auth0Id: user.sub });
      return dbUser;
    },
/*     user: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await User.findById(id);
    } */
  },
  Mutation: {
    createOrUpdateUser: async (_, { input }) => {
        const { auth0Id, email, name, picture } = input;
      console.log('input', input);
        try {
            // looks for the user by the auth0Id
            const existingUser = await User.findOne({ auth0Id });

            if (existingUser) {
                // if the user exists, update the user
                const updatedUser = await User.findOneAndUpdate(
                    {auth0Id},
                    { $set: { email, name, picture } },
                    { new: true }
                );
                return updatedUser;
            }

            // if the user does not exist, create a new user
            const newUser = new User({
                auth0Id,
                email,
                name,
                picture
            });
            return  newUser.save();
        } catch (error) {
            console.error('Error in createOrUpdateUser', error);
            throw new Error('Error creating or updating user');
        }

    },
    updateUser: async (_, { input }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await User.findByIdAndUpdate(
        user.id,
        { $set: input },
        { new: true }
      );
    },
    deleteUser: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      await User.findByIdAndDelete(user.id);
      return true;
    }
  }
};
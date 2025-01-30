
import { Notification } from "../../models/Notification.js";
import { requireAuth } from "../../middleware/auth.js";
import { 
  ValidationError, 
  NotFoundError,
  handleMongoError,
  validateObjectId 
} from "../../middleware/validation.js";

export const notificationResolvers = {
  Query: {
    notifications: async (_, { limit = 10, offset = 0 }, context) => {
      requireAuth( context );
      try {
        return await Notification.find({ userId: context.user.uid })
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit);
      } catch (error) {
        return handleMongoError(error);
      }
    },

    unreadNotificationsCount: async (_, __, context) => {
      requireAuth( context );
      try {
        return await Notification.countDocuments({ 
          userId: context.user.uid,
          read: false
        });
      } catch (error) {
        return handleMongoError(error);
      }
    }
  },

  Mutation: {
    markNotificationAsRead: async (_, { id }, context) => {
      requireAuth(context);
      validateObjectId(id);

      try {
        const notification = await Notification.findOneAndUpdate(
          { _id: id, userId: context.user.uid },
          { $set: { read: true } },
          { new: true }
        );

        if (!notification) {
          throw new NotFoundError('Notification', id);
        }

        return notification;
      } catch (error) {
        return handleMongoError(error);
      }
    },

    markAllNotificationsAsRead: async (_, __, context) => {
      requireAuth(context);

      try {
        await Notification.updateMany(
          { userId: context.user.uid, read: false },
          { $set: { read: true } }
        );
        return true;
      } catch (error) {
        return handleMongoError(error);
      }
    },

    deleteNotification: async (_, { id }, context) => {
      requireAuth(context);
      validateObjectId(id);

      try {
        const result = await Notification.deleteOne({ 
          _id: id,
          userId: context.user.uid 
        });
        
        if (result.deletedCount === 0) {
          throw new NotFoundError('Notification', id);
        }

        return true;
      } catch (error) {
        return handleMongoError(error);
      }
    }
  }
};
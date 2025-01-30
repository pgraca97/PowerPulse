
export const notificationMutations = `
  extend type Mutation {
    markNotificationAsRead(id: ID!): Notification!
    markAllNotificationsAsRead: Boolean!
    deleteNotification(id: ID!): Boolean!
  }
`;
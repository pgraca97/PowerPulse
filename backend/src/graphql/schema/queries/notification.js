
export const notificationQueries = `
  extend type Query {
    notifications(limit: Int, offset: Int): [Notification!]!
    unreadNotificationsCount: Int!
  }
`;
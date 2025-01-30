// backend/src/graphql/schema/queries/notification.js
export const notificationQueries = `
  extend type Query {
    notifications(limit: Int, offset: Int): [Notification!]!
    unreadNotificationsCount: Int!
  }
`;
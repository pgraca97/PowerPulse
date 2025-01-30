
export const notificationTypes = `
  type Notification {
    id: ID!
    type: NotificationType!
    title: String!
    message: String!
    read: Boolean!
    data: JSON
    createdAt: String!
    updatedAt: String!
  }

  enum NotificationType {
    NEW_EXERCISE
    LEVEL_UP
    ACHIEVEMENT
  }

  scalar JSON
`;
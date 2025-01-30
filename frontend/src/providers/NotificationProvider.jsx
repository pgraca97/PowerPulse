// src/providers/NotificationProvider.jsx
import { useQuery, useMutation, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { NotificationContext } from '../contexts/NotificationContext';
import { useAuth } from '../hooks/useAuth';

const GET_NOTIFICATIONS = gql`
  query GetNotifications($limit: Int, $offset: Int) {
    notifications(limit: $limit, offset: $offset) {
      id
      type
      title
      message
      read
      data
      createdAt
    }
    unreadNotificationsCount
  }
`;

const MARK_AS_READ = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      read
    }
  }
`;

const MARK_ALL_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id)
  }
`;

export function NotificationProvider({ children }) {
    const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery(GET_NOTIFICATIONS, {
    variables: { limit: 10, offset: 0 },
    skip: !user,
    fetchPolicy: 'network-only',
    onError: (error) => console.error('Notification query error:', error)
  });

  const [markAsReadMutation] = useMutation(MARK_AS_READ);
  const [markAllReadMutation] = useMutation(MARK_ALL_READ);
  const [deleteNotificationMutation] = useMutation(DELETE_NOTIFICATION);

  const markAsRead = async (notificationId) => {
    try {
      await markAsReadMutation({
        variables: { id: notificationId }
      });
      refetch();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllReadMutation();
      refetch();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await deleteNotificationMutation({
        variables: { id: notificationId }
      });
      refetch();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const value = {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadNotificationsCount || 0,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


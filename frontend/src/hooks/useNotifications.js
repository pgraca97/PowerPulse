// src/hooks/useNotifications.js
import { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

export const useNotifications = () => {
    console.log('useNotifications');
  const context = useContext(NotificationContext);
  console.log('context', context);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
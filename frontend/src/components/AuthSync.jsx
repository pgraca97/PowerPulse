// src/components/AuthSync.jsx
import { Loader } from '@mantine/core';
import { useAuthSync } from '../hooks/useAuthSync';

export function AuthSync() {
  const { isLoading, error } = useAuthSync();

  if (isLoading) {
    return <Loader size="xl" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />;
  }

  if (error) {
    console.error('Auth sync error:', error);
  }

  return null;
}
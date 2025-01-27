// src/pages/Dashboard.jsx
import { Title, Text, Loader } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader size="xl" className="mx-auto" />;
  }

  return (
    <div>
      <Title order={2} className="mb-4">
        Welcome, {user?.displayName || user?.email}!
      </Title>
      <Text>Your fitness journey starts here.</Text>
    </div>
  );
}
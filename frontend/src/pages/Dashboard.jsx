
// src/pages/Dashboard/Dashboard.jsx
import { Title, Text, Loader } from '@mantine/core';
import { useAuth0 } from '@auth0/auth0-react';

export function Dashboard() {
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return <Loader size="xl" className="mx-auto" />;
  }

  return (
    <div>
      <Title order={2} className="mb-4">
        Welcome, {user?.name}!
      </Title>
      <Text>Your fitness journey starts here.</Text>
    </div>
  );
}
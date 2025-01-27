// frontend/src/pages/Home.jsx
import React from 'react';
import { Container, Title, Text, Group, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuthSync } from '../hooks/useAuthSync';

export function Home() {
  const { isAuthenticated } = useAuthSync();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container size="lg" justify="center">
      <div className="text-center py-16">
        <Title order={1} className="mb-4">
          Transform Your Fitness Journey
        </Title>
        
        <Text size="xl" c="dimmed" className="mb-8 max-w-2xl mx-auto">
          Track your workouts, monitor your progress, and achieve your fitness goals with PowerPulse&apos;s
          comprehensive fitness management platform.
        </Text>

        <Group justify="center">
          <Button size="lg" onClick={() => navigate('/explore')}>
            Explore Features
          </Button>
          <Button size="lg" variant="light" onClick={() => navigate('/about')}>
            Learn More
          </Button>
        </Group>
      </div>
    </Container>
  );
}
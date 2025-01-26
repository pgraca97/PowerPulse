// src/pages/Home/Home.jsx
import { Title, Text, Button, Group } from '@mantine/core';
import { useAuth0 } from '@auth0/auth0-react';

export function Home() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="text-center py-16">
      <Title order={1} className="mb-4">
        Transform Your Fitness Journey
      </Title>
      <Text size="xl" c="dimmed" className="mb-8 max-w-2xl mx-auto">
        Track your workouts, monitor your progress, and achieve your fitness goals with PowerPulse&apos;s
        comprehensive fitness management platform.
      </Text>
      <Group justify="center">
        <Button
          size="lg"
          onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
        >
          Get Started
        </Button>
        <Button size="lg" variant="light">
          Learn More
        </Button>
      </Group>
    </div>
  );
}

import React from 'react';
import { Avatar, Paper, Text } from '@mantine/core';

const UserCard = ({ imageUrl, userName, userGreeting }) => {
  return (
    <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
      <Avatar
        src={imageUrl}
        alt={userName || 'User profile picture'}
        size={120}
        radius={120}
        mx="auto"
      >
        {userName ? userName.substring(0, 2).toUpperCase() : null}
      </Avatar>
      <Text ta="center" fz="lg" fw={500} mt="md">
        {userName}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        {userGreeting}
      </Text>
    </Paper>
  );
};

export default UserCard;
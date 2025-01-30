// src/components/cards/WelcomeCard.jsx
import { Avatar, Paper, Text, List, Title } from '@mantine/core';
import PropTypes from 'prop-types';

export function WelcomeCard({ imageUrl, userName, userGreeting, goals }) {
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
      <Title order={3} ta="center" mt="md">
        {userName}
      </Title>
      <Text ta="center" c="dimmed" fz="sm">
        {userGreeting}
      </Text>

      {goals && goals.length > 0 && (
        <>
          <Text ta="center" fw={500} mt="md" mb="xs">
            Never forget your goals:
          </Text>
          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <Text size="lg" c="blue">
                •
              </Text>
            }
          >
            {goals.map((goal, index) => (
              <List.Item key={index}>{goal}</List.Item>
            ))}
          </List>
        </>
      )}
    </Paper>
  );
}

WelcomeCard.propTypes = {
  imageUrl: PropTypes.string,
  userName: PropTypes.string,
  userGreeting: PropTypes.string,
  goals: PropTypes.arrayOf(PropTypes.string)
};

WelcomeCard.defaultProps = {
  imageUrl: null,
  userName: '',
  userGreeting: 'Welcome!',
  goals: []
};

export default WelcomeCard;
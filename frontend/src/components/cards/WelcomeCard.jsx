// src/components/cards/WelcomeCard.jsx

import { Avatar, Paper, Text } from "@mantine/core";
import PropTypes from "prop-types";

export function WelcomeCard({ imageUrl, userName, userGreeting }) {
  return (
    <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
      <Avatar
        src={imageUrl}
        alt={userName || "User profile picture"}
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
}

WelcomeCard.propTypes = {
  imageUrl: PropTypes.string,
  userName: PropTypes.string,
  userGreeting: PropTypes.string,
};

WelcomeCard.defaultProps = {
  imageUrl: null,
  userName: "",
  userGreeting: "Welcome!",
};

export default WelcomeCard;

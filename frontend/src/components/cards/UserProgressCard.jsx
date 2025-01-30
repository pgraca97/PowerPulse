
import { Card, Title, Text, Progress, Group, Stack } from '@mantine/core';
import PropTypes from 'prop-types';

export function UserProgressCard({ progress }) {
  if (!progress?.length) {
    return (
      <Card withBorder p="lg">
        <Text c="dimmed" ta="center">No progress recorded yet</Text>
      </Card>
    );
  }

  return (
    <Card withBorder p="lg">
      <Title order={3} mb="md">Progress Overview</Title>
      <Stack>
        {progress.map((item) => (
          <div key={item.exerciseType.id}>
            <Group position="apart" mb="xs">
              <Text fw={500}>{item.exerciseType.title}</Text>
              <Text size="sm" c="dimmed">Level {item.level}</Text>
            </Group>
            <Progress 
              value={(item.points / 100) * 100} 
              label={`${item.points} points`}
              size="md"
              mb="md"
            />
          </div>
        ))}
      </Stack>
    </Card>
  );
}

UserProgressCard.propTypes = {
  progress: PropTypes.arrayOf(PropTypes.shape({
    exerciseType: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    }),
    level: PropTypes.number.isRequired,
    points: PropTypes.number.isRequired
  }))
};

export default UserProgressCard;
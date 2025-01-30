
import { Card, Text, Stack, Progress, Loader } from "@mantine/core";
import { useProgress } from "../../hooks/useProgress";

export function ProgressCard() {
  const { progress, loading, error } = useProgress();

  if (loading) {
    return (
      <Card withBorder padding="lg" radius="md">
        <Stack align="center">
          <Loader />
        </Stack>
      </Card>
    );
  }

  if (error) {
    return (
      <Card withBorder padding="lg" radius="md">
        <Text color="red">Error loading progress</Text>
      </Card>
    );
  }

  if (!progress || progress.length === 0) {
    return (
      <Card withBorder padding="lg" radius="md">
        <Text c="dimmed" ta="center">
          No exercises done yet
        </Text>
      </Card>
    );
  }

  return (
    <Card withBorder padding="lg" radius="md">
      <Stack mt="md">
        {progress.map((item) => {
          const progressPercentage = item.points % 100;

          return (
            <div key={item.exerciseType.id}>
              <Text fz="md" fw="bold">
                {item.exerciseType.title}
              </Text>
              <Text c="dimmed" fz="sm" mb={4}>
                Level {item.level}
              </Text>
              <Text span fw={500} c="bright">
                {item.points} Points
              </Text>
              <Progress value={progressPercentage} mt={5} />
            </div>
          );
        })}
      </Stack>
    </Card>
  );
}


export default ProgressCard;
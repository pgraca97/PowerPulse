// src/components/cards/ExerciseCard.jsx
import { useState, useEffect, useCallback } from "react";
import { Badge, Button, Card, Group, Text, Stack, Loader, Grid } from "@mantine/core";
import { useExercises } from "../../hooks/useExercises.js";
import { useProgress } from "../../hooks/useProgress";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import classes from "./ActionsGrid.module.css";
import PropTypes from 'prop-types';

export function ExerciseCard({ searchTerm = "", filters = {} }) {
  const navigate = useNavigate();
  const [processingExercise, setProcessingExercise] = useState(null);
  
  // Get exercises with initial filters
  const { exercises, loading, error, loadMore, hasMore, total } = useExercises({
    search: searchTerm,
    typeId: filters.typeId,  
    difficulty: filters.difficulty,
    muscle: filters.muscle,
    limit: 10
  });

  const { completeExercise, refetchProgress } = useProgress();

  // Infinite scroll handler
  const handleScroll = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleScroll, { threshold: 0.5 });
    const loadMoreTrigger = document.querySelector('#load-more-trigger');
    if (loadMoreTrigger) observer.observe(loadMoreTrigger);
    return () => observer.disconnect();
  }, [handleScroll]);

  const handleStartExercise = async (e, exerciseId) => {
    try {
      e.stopPropagation();
      if (processingExercise) return;
      
      setProcessingExercise(exerciseId);
      await completeExercise(exerciseId);
      
      toast.success("Exercise completed successfully!");
      refetchProgress();
    } catch (error) {
      toast.error(error.message || "Failed to complete exercise");
    } finally {
      setProcessingExercise(null);
    }
  };

  const handleCardClick = (exerciseId) => {
    navigate(`/exercise/${exerciseId}`);
  };

  if (loading && !exercises.length) {
    return (
      <Stack align="center" p="xl">
        <Loader />
      </Stack>
    );
  }

  if (error) {
    return (
      <Text color="red" align="center" p="xl">
        Error loading exercises: {error.message}
      </Text>
    );
  }

  if (!exercises.length) {
    return (
      <Text align="center" p="xl">
        {searchTerm ? "No exercises found matching your search" : "No exercises found"}
      </Text>
    );
  }

  const formatMuscles = (muscles) => {
    return muscles
      .map((muscle) => muscle.charAt(0) + muscle.slice(1).toLowerCase())
      .join(", ");
  };

  const formatDifficulty = (difficulty) => {
    const difficultyMap = {
      BEGINNER: "Beginner",
      INTERMEDIATE: "Intermediate",
      ADVANCED: "Advanced",
    };
    return difficultyMap[difficulty] || difficulty;
  };

  return (
    <>
      <Grid gutter="md">
        {exercises.map((exercise) => (
          <Grid.Col span={6} key={exercise.id}>
            <Card
              withBorder
              radius="md"
              p="md"
              className={classes.card}
              onClick={() => handleCardClick(exercise.id)}
              style={{
                cursor: "pointer",
                opacity: processingExercise === exercise.id ? 0.7 : 1,
                height: "280px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Card.Section className={classes.section} mt="md">
                <Group justify="apart">
                  <Text fz="lg" fw={500}>
                    {exercise.title}
                  </Text>
                  <Badge size="sm" variant="light">
                    {formatMuscles(exercise.muscles)}
                  </Badge>
                </Group>

                <Text
                  fz="sm"
                  mt="xs"
                  color="dimmed"
                  lineClamp={3}
                  style={{
                    minHeight: "3.6em",
                    overflow: "hidden",
                  }}
                >
                  {exercise.description}
                </Text>

                <Group mt="md" spacing="xs">
                  <Badge size="sm" variant="outline">
                    Level: {formatDifficulty(exercise.difficulty)}
                  </Badge>
                  <Badge size="sm" variant="outline">
                    Points: {exercise.pointsAwarded}
                  </Badge>
                  <Badge size="sm" variant="outline">
                    Type: {exercise.type.title}
                  </Badge>
                </Group>
              </Card.Section>

              <Group mt="xs">
                <Button
                  radius="md"
                  style={{ flex: 1 }}
                  loading={processingExercise === exercise.id}
                  disabled={processingExercise === exercise.id}
                  onClick={(e) => handleStartExercise(e, exercise.id)}
                >
                  {processingExercise === exercise.id
                    ? "Starting..."
                    : "Start Exercise"}
                </Button>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      
      {/* Infinite scroll trigger */}
      {hasMore && (
        <div id="load-more-trigger" style={{ height: '20px', margin: '20px 0' }}>
          <Loader size="sm" />
        </div>
      )}

      {/* Total count */}
      <Text align="center" size="sm" c="dimmed" mt="md">
        Showing {exercises.length} of {total} exercises
      </Text>
    </>
  );
}

ExerciseCard.propTypes = {
  searchTerm: PropTypes.string,
  filters: PropTypes.shape({
    typeId: PropTypes.string, 
    difficulty: PropTypes.string,
    muscle: PropTypes.string
  })
};

export default ExerciseCard;
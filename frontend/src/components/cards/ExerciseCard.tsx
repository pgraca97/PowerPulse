import React from 'react';
import { IconHeart } from '@tabler/icons-react';
import { ActionIcon, Badge, Button, Card, Group, Image, Text, Stack, Loader, Grid } from '@mantine/core';
import { useExercise } from '../../hooks/useExercise';
import classes from './ActionsGrid.module.css';
import { useProgress } from '../../hooks/useProgress';
import toast from 'react-hot-toast';

interface ExerciseCardProps {
    searchTerm?: string;
    filters?: {
      type: string | null;
      difficulty: string | null;
      muscle: string | null;
    };
  }



export function ExerciseCard({ searchTerm = '', filters = {} }: ExerciseCardProps) {
  const { exercises, loading, error } = useExercise();
  const {completeExercise} = useProgress()
  // Filter exercises based on search term and filters
  const filteredExercises = React.useMemo(() => {
    if (!exercises) return [];
    
    return exercises.filter(exercise => {
      // Search term filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        exercise.title.toLowerCase().includes(searchLower) ||
        exercise.description.toLowerCase().includes(searchLower) ||
        exercise.type.title.toLowerCase().includes(searchLower) ||
        exercise.muscles.some(muscle => muscle.toLowerCase().includes(searchLower)) ||
        exercise.difficulty.toLowerCase().includes(searchLower);

      // Apply filters
      const matchesDifficulty = !filters.difficulty || exercise.difficulty === filters.difficulty;
      const matchesMuscle = !filters.muscle || exercise.muscles.includes(filters.muscle);
      const matchesType = !filters.type || exercise.type.title.toLowerCase() === filters.type.toLowerCase();

      return matchesSearch && matchesDifficulty && matchesMuscle && matchesType;
    });
  }, [exercises, searchTerm, filters]);


  const handleStartExercise = async (exerciseId) => {
    try {
      if (!exerciseId) {
        throw new Error('Invalid exercise ID');
      }
      await completeExercise(exerciseId);
      toast.success('Exercise completed successfully!', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error details:', error);
      toast.error(error.message || 'Failed to complete exercise. Please try again.', {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  if (loading) {
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

  if (!filteredExercises || filteredExercises.length === 0) {
    return (
      <Text align="center" p="xl">
        {searchTerm ? 'No exercises found matching your search' : 'No exercises found'}
      </Text>
    );
  }

  const formatMuscles = (muscles: string[]) => {
    return muscles.map(muscle => 
      muscle.charAt(0) + muscle.slice(1).toLowerCase()
    ).join(', ');
  };

  const formatDifficulty = (difficulty: string) => {
    const difficultyMap = {
      'BEGINNER': 'Beginner',
      'INTERMEDIATE': 'Intermediate',
      'ADVANCED': 'Advanced'
    };
    return difficultyMap[difficulty] || difficulty;
  };

  return (
    <Grid gutter="md">
      {filteredExercises.map((exercise) => (
        <Grid.Col span={6} key={exercise.id}>
          <Card withBorder radius="md" p="md" className={classes.card}>
            <Card.Section className={classes.section} mt="md">
              <Group justify="apart">
                <Text fz="lg" fw={500}>
                  {exercise.title}
                </Text>
                <Badge size="sm" variant="light">
                  {formatMuscles(exercise.muscles)}
                </Badge>
              </Group>
              
              <Text fz="sm" mt="xs" color="dimmed">
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
                onClick={() => {
                    handleStartExercise(exercise.id)
                  console.log('Selected exercise:', exercise.id);
                }}
              >
                Start Exercise
              </Button>
            </Group>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
}

export default ExerciseCard;
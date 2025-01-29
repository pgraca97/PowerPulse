import { useParams, useNavigate } from 'react-router-dom';
import { Card, Group, Badge, Text, Button, Stack, Loader, Container, Alert } from '@mantine/core';
import { useExercise } from '../hooks/useExercise';
import { useProgress } from '../hooks/useProgress';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IconAlertCircle } from '@tabler/icons-react';

export function ExerciseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { exercise, loading, error, refetchExercise } = useExercise(id);
  const { completeExercise } = useProgress();

  // Validate ID parameter
  useEffect(() => {
    if (!id) {
      navigate('/exercises', { replace: true });
      toast.error('Invalid exercise ID');
    }
  }, [id, navigate]);

  // Handle network errors with retry
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        refetchExercise();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, refetchExercise]);

  const handleStartExercise = async () => {
    if (isSubmitting) return; // Prevent double submission
    
    try {
      setIsSubmitting(true);
      
      if (!id || !exercise) {
        throw new Error('Exercise data is not available');
      }

      await completeExercise(id);
      toast.success('Exercise completed successfully!', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to complete exercise';
      
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
      });
      
      console.error('Exercise completion error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMuscles = (muscles: string[]) => {
    try {
      if (!Array.isArray(muscles)) return 'Not specified';
      return muscles
        .filter(muscle => typeof muscle === 'string')
        .map(muscle => muscle.charAt(0).toUpperCase() + muscle.slice(1).toLowerCase())
        .join(', ') || 'Not specified';
    } catch (error) {
      console.error('Error formatting muscles:', error);
      return 'Not specified';
    }
  };

  const formatDifficulty = (difficulty: string) => {
    try {
      const difficultyMap = {
        'BEGINNER': 'Beginner',
        'INTERMEDIATE': 'Intermediate',
        'ADVANCED': 'Advanced'
      };
      return difficultyMap[difficulty] || 'Not specified';
    } catch (error) {
      console.error('Error formatting difficulty:', error);
      return 'Not specified';
    }
  };

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Stack align="center" spacing="md">
          <Loader size="xl" />
          <Text>Loading exercise details...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Alert 
          icon={<IconAlertCircle size={16} />}
          title="Error loading exercise"
          color="red"
          variant="filled"
        >
          <Stack spacing="md">
            <Text>{error.message}</Text>
            <Button 
              variant="white" 
              onClick={() => refetchExercise()}
            >
              Try Again
            </Button>
            <Button 
              variant="subtle" 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </Stack>
        </Alert>
      </Container>
    );
  }

  if (!exercise) {
    return (
      <Container size="md" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Exercise Not Found"
          color="yellow"
          variant="filled"
        >
          <Stack spacing="md">
            <Text>The exercise you're looking for doesn't exist or has been removed.</Text>
            <Button 
              variant="white" 
              onClick={() => navigate('/exercises')}
            >
              Return to Exercises
            </Button>
          </Stack>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Card withBorder radius="md" p="xl">
        <Stack spacing="lg">
          <Group position="apart">
            <Text size="xl" weight={700}>
              {exercise.title || 'Untitled Exercise'}
            </Text>
            <Button 
              variant="subtle" 
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Back to Exercises
            </Button>
          </Group>

          <Group spacing="xs">
            <Badge size="lg" variant="filled" color="blue">
              {exercise.type?.title || 'No Type'}
            </Badge>
            <Badge size="lg" variant="outline">
              Level: {formatDifficulty(exercise.difficulty)}
            </Badge>
            <Badge size="lg" variant="outline">
              Points: {exercise.pointsAwarded || 0}
            </Badge>
          </Group>

          <Badge size="lg" variant="light">
            Muscles: {formatMuscles(exercise.muscles)}
          </Badge>

          <Stack spacing="md">
            <Text size="lg" weight={500}>Description</Text>
            <Text>{exercise.description || 'No description available'}</Text>

            <Text size="lg" weight={500}>Instructions</Text>
            <Text>{exercise.instructions || 'No instructions available'}</Text>
          </Stack>

          <Button 
            size="lg"
            fullWidth
            onClick={handleStartExercise}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Starting Exercise...' : 'Start Exercise'}
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}

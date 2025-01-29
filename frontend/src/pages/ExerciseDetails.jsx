// src/pages/ExerciseDetails.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  Card, 
  Group, 
  Badge, 
  Text, 
  Button, 
  Stack, 
  Loader, 
  Container, 
  Alert 
} from '@mantine/core';
import { useExerciseDetails } from '../hooks/useExerciseDetails';
import { useProgress } from '../hooks/useProgress';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IconAlertCircle, IconBarbell } from '@tabler/icons-react';

export function ExerciseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { exercise, loading, error, refetch } = useExerciseDetails(id);
  const { completeExercise } = useProgress();


  useEffect(() => {
    if (!id) {
      toast.error('Invalid exercise ID');
      navigate('/dashboard', { replace: true });
    }
  }, [id, navigate]);


  const formatters = {
    equipment: (equipment) => {
      if (!equipment) return 'No equipment needed';
      return equipment.charAt(0).toUpperCase() + equipment.slice(1).toLowerCase();
    },

    muscles: (muscles) => {
      if (!Array.isArray(muscles)) return 'Not specified';
      return muscles
        .map(muscle => muscle.replace('_', ' ').toLowerCase())
        .map(muscle => muscle.charAt(0).toUpperCase() + muscle.slice(1))
        .join(', ') || 'Not specified';
    },

    difficulty: (difficulty) => {
      const map = {
        'BEGINNER': 'Beginner',
        'INTERMEDIATE': 'Intermediate',
        'ADVANCED': 'Advanced'
      };
      return map[difficulty] || 'Not specified';
    }
  };


  const handleStartExercise = async () => {
    if (isSubmitting || !id || !exercise) return;

    try {
      setIsSubmitting(true);
      await completeExercise(id);
      
      toast.success('Exercise completed successfully!', {
        duration: 3000,
        position: 'top-right',
      });
      
    } catch (error) {
      toast.error(error.message || 'Failed to complete exercise', {
        duration: 4000,
        position: 'top-right',
      });
      console.error('Exercise completion error:', error);
    } finally {
      setIsSubmitting(false);
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
            <Group>
              <Button variant="white" onClick={refetch}>
                Try Again
              </Button>
              <Button variant="subtle" onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </Group>
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
            <Text>This exercise doesn&apos;t exist or has been removed.</Text>
            <Button 
              variant="white" 
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
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
              {exercise.title}
            </Text>
            <Button 
              variant="subtle" 
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
            >
              Back to Dashboard
            </Button>
          </Group>

    
          <Group spacing="xs">
            <Badge size="lg" variant="filled" color="blue">
              {exercise.type?.title || 'No Type'}
            </Badge>
            <Badge size="lg" variant="outline">
              Level: {formatters.difficulty(exercise.difficulty)}
            </Badge>
            <Badge size="lg" variant="outline">
              Points: {exercise.pointsAwarded || 0}
            </Badge>
          </Group>

 
          <Badge size="lg" variant="light">
            Muscles: {formatters.muscles(exercise.muscles)}
          </Badge>

 
          <Card 
            withBorder 
            radius="md" 
            p="sm" 
            style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}
          >
            <Stack spacing="xs">
              <Group spacing="xs">
                <IconBarbell size={20} />
                <Text size="lg" weight={500}>Required Equipment</Text>
              </Group>
              <Text>{formatters.equipment(exercise.equipment)}</Text>
            </Stack>
          </Card>

     
          <Stack spacing="md">
            <Text size="lg" weight={500}>Description</Text>
            <Text>{exercise.description || 'No description available'}</Text>

            <Text size="lg" weight={500}>Instructions</Text>
            {Array.isArray(exercise.instructions) ? (
              <Stack spacing="xs">
                {exercise.instructions.map((instruction, index) => (
                  <Text key={index}>{index + 1}. {instruction}</Text>
                ))}
              </Stack>
            ) : (
              <Text>{exercise.instructions || 'No instructions available'}</Text>
            )}
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
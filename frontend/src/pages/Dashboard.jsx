// src/pages/Dashboard.jsx
import { Title, Loader, Container, Flex, Box } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import ExerciseCard from '../components/cards/ExerciseCard';
import ProgressCard from '../components/cards/ProgressCard.jsx';
import WelcomeCard from '../components/cards/WelcomeCard.jsx';
import { FilterButtons } from '../components/cards/FiltersCard';
import { InputWithButton } from '../components/forms/searchInput';
import { useProfile } from '../hooks/useProfile';
import { useState, useMemo } from 'react';
import { useExercises } from '../hooks/useExercises.js';
import { useExerciseType } from '../hooks/useExerciseType';

export function Dashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    typeId: null,
    difficulty: null,
    muscle: null
  });
  
  const { exerciseTypes, loading: typesLoading, error: typeError } = useExerciseType();
  const { exercises, loading: exercisesLoading, error: exercisesError } = useExercises();
  
  // Extract unique difficulties and muscles from exercises
  const { difficulties, muscles } = useMemo(() => {
    if (!exercises) return { difficulties: [], muscles: [] };
    
    const difficultySet = new Set();
    const muscleSet = new Set();
    
    exercises.forEach((exercise) => {
      if (exercise.difficulty) {
        difficultySet.add(exercise.difficulty);
      }
      if (exercise.muscles) {
        exercise.muscles.forEach((muscle) => muscleSet.add(muscle));
      }
    });
    
    return {
      difficulties: Array.from(difficultySet),
      muscles: Array.from(muscleSet),
    };
  }, [exercises]);
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  const handleClearAll = () => {
    setFilters({
      typeId: null,
      difficulty: null,
      muscle: null
    });
    setSearchTerm(''); // Limpa o search também
  };
  
  if (typesLoading || exercisesLoading) {
    return <Loader size="xl" className="mx-auto" />;
  }
  
  if (typeError || exercisesError) {
    console.error('Error loading data:', { typeError, exercisesError });
  }
  
  return (
    <Container size="xl" py="md">
    <Flex gap="md" align="flex-start">
    {/* Left Column - User Info & Progress */}
    <Box w="20%">
    <WelcomeCard
    imageUrl={profile?.picture?.url}
    userName={user?.displayName}
    userGreeting="Ready for your fitness journey?"
    goals={profile?.profile?.goals}
    />
    <Box mt="md" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
    <Title order={3} mb="md">Your Progress</Title>
    <ProgressCard />
    </Box>
    </Box>
    
    {/* Main Column */}
    <Box w="60%">
    <InputWithButton 
    onSearch={setSearchTerm}
    value={searchTerm}
    onChange={setSearchTerm}
    />
    <Box mt="md">
    <ExerciseCard searchTerm={searchTerm} filters={filters} />
    </Box>
    </Box>
    
    {/* Filters Column */}
    <Box w="20%">
    <Title order={3} mb="md">Filters</Title>
    <FilterButtons 
    onFilterChange={handleFilterChange}
    selectedFilters={filters}
    exerciseTypes={exerciseTypes || []}
    difficulties={difficulties}
    muscles={muscles}
    onClearAll={handleClearAll}
    />
    </Box>
    </Flex>
    </Container>
  );
}

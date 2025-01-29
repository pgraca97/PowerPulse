import { Title, Loader, Grid } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import ExerciseCard from '../components/cards/exerciseCard';
import { ProgressCard } from '../components/cards/progressCard';
import UserCard from '../components/cards/welcomeCard';
import { FilterButtons } from '../components/cards/filtersCard';
import { InputWithButton } from '../components/forms/searchInput';
import { createStyles } from '@mantine/styles'; 
import { useProfile } from '../hooks/useProfile';
import { useEffect, useState,  useMemo  } from 'react';
import { useExercise } from '../hooks/useExercise';
import { useExerciseType } from '../hooks/useExerciseType';

const useStyles = createStyles((theme) => ({
  dashboardContainer: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    height: '100vh',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  firstColumn: {
    flex: 0.3, 
  },
  mainColumn: {
    flex: 0.6, 
  },
  thirdColumn: {
    flex: 0.1,  
  },
  scrollableSection: {
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 200px)', 
    paddingRight: '8px',
  },
  exerciseCard: {
    width: '100%',
    maxWidth: '300px', 
  },
}));

export function Dashboard() {
  const { classes } = useStyles();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: null,
    difficulty: null,
    muscle: null
  });
  const { getExerciseTypes } = useExerciseType();
  const { loading: exerciseTypesLoading, error: typeError, exerciseTypes } = getExerciseTypes();
  const { exercises, loading: exercisesLoading, error: exercisesError } = useExercise();


  // Extract unique difficulties and muscles from exercises
  const { difficulties, muscles } = useMemo(() => {
    if (!exercises) return { difficulties: [], muscles: [] };

    const difficultySet = new Set();
    const muscleSet = new Set();

    exercises.forEach(exercise => {
      if (exercise.difficulty) {
        difficultySet.add(exercise.difficulty);
      }
      if (exercise.muscles) {
        exercise.muscles.forEach(muscle => muscleSet.add(muscle));
      }
    });

    return {
      difficulties: Array.from(difficultySet),
      muscles: Array.from(muscleSet)
    };
  }, [exercises]);



  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };


  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
}, [imagePreview]);

if ( exerciseTypesLoading || exercisesLoading) {
  return <Loader size="xl" className="mx-auto" />;
}

if (typeError || exercisesError) {
  console.error('Error loading data:', { typeError, exercisesError });
}




  return (
    <div className={classes.dashboardContainer}>
      {/* First Column */}
      <div className={`${classes.column} ${classes.firstColumn}`}>
        <UserCard
          imageUrl={profile?.picture?.url || imagePreview}
          userName={user?.displayName}
          userGreeting="Ready for your fitness journey?"
        />
        <div className={classes.scrollableSection}>
          <Title order={3} className="mt-4">Your Progress</Title>
          <ProgressCard />
        </div>
      </div>

  
      {/* Second Column */}
      <div className={`${classes.column} ${classes.mainColumn}`}>
        <InputWithButton onSearch={setSearchTerm} />
        <div className={classes.scrollableSection}>
          <Title order={3} className="mt-4">Exercises</Title>
          <ExerciseCard searchTerm={searchTerm} filters={filters} />
        </div>
      </div>

      {/* Third Column */}
      <div className={`${classes.column} ${classes.thirdColumn}`}>
        <Title order={3}>Filters</Title>
        <FilterButtons 
          onFilterChange={handleFilterChange}
          selectedFilters={filters}
          exerciseTypes={exerciseTypes || []}
          difficulties={difficulties}
          muscles={muscles}
        />
      </div>
    </div>
  );
}
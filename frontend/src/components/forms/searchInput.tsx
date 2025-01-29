import React from 'react';
import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { ActionIcon, TextInput, Select, Group, useMantineTheme } from '@mantine/core';
import { useExerciseType } from '../../hooks/useExerciseType';

interface InputWithButtonProps {
  onSearch: (value: string, typeId?: string) => void;
  onFilterChange?: (filters: { searchValue: string; typeId?: string }) => void;
}

export function InputWithButton({ onSearch, onFilterChange }: InputWithButtonProps) {
  const theme = useMantineTheme();
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<string | null>(null);

  // Fetch exercise types from the database
  const { exerciseTypes } = useExerciseType();

  const handleSearch = () => {
    onSearch(searchValue, selectedType || undefined);
    if (onFilterChange) {
      onFilterChange({ searchValue, typeId: selectedType || undefined });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTypeChange = (value: string | null) => {
    setSelectedType(value);
    if (onFilterChange) {
      onFilterChange({ searchValue, typeId: value || undefined });
    }
  };

  return (
    <Group>
      <TextInput
        radius="xl"
        size="md"
        placeholder="Search exercises..."
        rightSectionWidth={42}
        leftSection={<IconSearch size={18} stroke={1.5} />}
        rightSection={
          <ActionIcon
            size={32}
            radius="xl"
            color={theme.primaryColor}
            variant="filled"
            onClick={handleSearch}
          >
            <IconArrowRight size={18} stroke={1.5} />
          </ActionIcon>
        }
        value={searchValue}
        onChange={(event) => setSearchValue(event.currentTarget.value)}
        onKeyPress={handleKeyPress}
        style={{ width: '100%', maxWidth: '800px' }}
      />
    </Group>
  );
}
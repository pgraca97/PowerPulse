import React from 'react';
import { Stack, Button, Menu, Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

interface FilterButtonsProps {
    onFilterChange: (filterType: string, value: string | null) => void;
    selectedFilters: {
      type: string | null;
      difficulty: string | null;
      muscle: string | null;
    };
    exerciseTypes: { title: string; description: string }[];
    difficulties: string[]; 
    muscles: string[]; 
  }
  

export function FilterButtons({ onFilterChange, selectedFilters, exerciseTypes,difficulties, muscles }: FilterButtonsProps) {
  

  return (
    <Stack spacing="md">
    {/* Difficulty Filter */}
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          rightSection={<IconChevronDown size={14} />}
          color={selectedFilters.difficulty ? "blue" : "gray"}
        >
          {selectedFilters.difficulty || 'Difficulty'}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {selectedFilters.difficulty && (
          <Menu.Item
            color="red"
            onClick={() => onFilterChange('difficulty', null)}
          >
            Clear Filter
          </Menu.Item>
        )}
        {difficulties.map((diff) => (
          <Menu.Item
            key={diff}
            onClick={() => onFilterChange('difficulty', diff)}
          >
            {diff.charAt(0) + diff.slice(1).toLowerCase()}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>

    {/* Muscle Filter */}
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          rightSection={<IconChevronDown size={14} />}
          color={selectedFilters.muscle ? "blue" : "gray"}
        >
          {selectedFilters.muscle || 'Muscle'}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {selectedFilters.muscle && (
          <Menu.Item
            color="red"
            onClick={() => onFilterChange('muscle', null)}
          >
            Clear Filter
          </Menu.Item>
        )}
        {muscles.map((muscle) => (
          <Menu.Item
            key={muscle}
            onClick={() => onFilterChange('muscle', muscle)}
          >
            {muscle.charAt(0) + muscle.slice(1).toLowerCase().replace('_', ' ')}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>

    {/* Type Filter */}
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          rightSection={<IconChevronDown size={14} />}
          color={selectedFilters.type ? "blue" : "gray"}
        >
          {selectedFilters.type || 'Type'}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {selectedFilters.type && (
          <Menu.Item
            color="red"
            onClick={() => onFilterChange('type', null)}
          >
            Clear Filter
          </Menu.Item>
        )}
        {exerciseTypes.map((type) => (
          <Menu.Item
            key={type.title}
            onClick={() => onFilterChange('type', type.title)}
          >
            {type.title}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>

    {/* Clear All Filters Button */}
    {(selectedFilters.type || selectedFilters.difficulty || selectedFilters.muscle) && (
      <Button
        variant="outline"
        color="red"
        onClick={() => {
          onFilterChange('type', null);
          onFilterChange('difficulty', null);
          onFilterChange('muscle', null);
        }}
      >
        Clear All Filters
      </Button>
    )}
    </Stack>
  );
}
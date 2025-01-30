

import { Stack, Button, Menu } from '@mantine/core';
import { IconChevronDown, IconTrash } from '@tabler/icons-react';
import PropTypes from 'prop-types';

export function FilterButtons({ 
  onFilterChange, 
  selectedFilters, 
  exerciseTypes, 
  difficulties, 
  muscles,
  onClearAll // Novo prop para limpar tudo, incluindo search
}) {
  const getTypeTitle = (typeId) => {
    const type = exerciseTypes.find(t => t.id === typeId);
    return type ? type.title : 'Type';
  };

  // Função para limpar todos os filtros
  const handleClearAll = () => {
    onFilterChange('typeId', null);
    onFilterChange('difficulty', null);
    onFilterChange('muscle', null);
    onClearAll?.(); // Chama a função que vai limpar o search também
  };

  const hasActiveFilters = selectedFilters.typeId || 
                          selectedFilters.difficulty || 
                          selectedFilters.muscle;
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
            color={selectedFilters.typeId ? "blue" : "gray"}
          >
            {selectedFilters.typeId ? getTypeTitle(selectedFilters.typeId) : 'Type'}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {selectedFilters.typeId && (
            <Menu.Item
              color="red"
              onClick={() => onFilterChange('typeId', null)}
            >
              Clear Filter
            </Menu.Item>
          )}
          {exerciseTypes.map((type) => (
            <Menu.Item
              key={type.id}
              onClick={() => onFilterChange('typeId', type.id)}
            >
              {type.title}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      {/* Clear All Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          color="red"
          onClick={handleClearAll}
          leftIcon={<IconTrash size={16} />}
        >
          Clear All Filters
        </Button>
      )}
    </Stack>
  );
}

FilterButtons.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  selectedFilters: PropTypes.shape({
    typeId: PropTypes.string,
    difficulty: PropTypes.string,
    muscle: PropTypes.string
  }).isRequired,
  exerciseTypes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  })).isRequired,
  difficulties: PropTypes.arrayOf(PropTypes.string).isRequired,
  muscles: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClearAll: PropTypes.func
};

export default FilterButtons;
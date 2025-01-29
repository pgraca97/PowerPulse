// src/components/forms/searchInput.jsx
import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { ActionIcon, TextInput, Group, useMantineTheme } from '@mantine/core';
import PropTypes from 'prop-types';
import { useState } from 'react';

export function InputWithButton({ onSearch }) {
  const theme = useMantineTheme();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    onSearch(searchValue);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
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

InputWithButton.propTypes = {
  onSearch: PropTypes.func.isRequired
};
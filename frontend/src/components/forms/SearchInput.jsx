// src/components/forms/SearchInput.jsx
import { IconArrowRight, IconSearch, IconX } from '@tabler/icons-react';
import { ActionIcon, TextInput, Group, useMantineTheme } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

export function InputWithButton({ onSearch, value, onChange }) {
  const theme = useMantineTheme();
  const [searchValue, setSearchValue] = useState(value || '');
  const [debouncedValue] = useDebouncedValue(searchValue, 300);

  const handleImmediateSearch = useCallback(() => {
    onSearch(searchValue);
  }, [onSearch, searchValue]);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  useEffect(() => {
    if (value !== searchValue) {
      setSearchValue(value || '');
    }
  }, [value, searchValue]);

  const handleChange = useCallback((event) => {
    const newValue = event.currentTarget.value;
    setSearchValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  const handleClear = useCallback(() => {
    setSearchValue('');
    onChange?.('');
    onSearch('');
  }, [onChange, onSearch]);

  return (
    <Group>
      <TextInput
        radius="xl"
        size="md"
        placeholder="Search exercises..."
        rightSectionWidth={82} 
        leftSection={<IconSearch size={18} stroke={1.5} />}
        rightSection={
          <Group gap={8}  >
            {searchValue && (
              <ActionIcon 
                size={32} 
                variant="subtle" 
                onClick={handleClear}
                title="Clear search"
              >
                <IconX size={18} />
              </ActionIcon>
            )}
            <ActionIcon
              size={32}
              radius="xl"
              color={theme.primaryColor}
              variant="filled"
              onClick={handleImmediateSearch}
              title="Search now"
            >
              <IconArrowRight size={18} stroke={1.5} />
            </ActionIcon>
          </Group>
        }
        value={searchValue}
        onChange={handleChange}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleImmediateSearch();
          }
        }}
        style={{ width: '100%', maxWidth: '800px' }}
      />
    </Group>
  );
}

InputWithButton.propTypes = {
  onSearch: PropTypes.func.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func
};
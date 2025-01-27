// src/pages/ProfileEdit.jsx
import { useEffect, useCallback, useState } from 'react';
import { useForm } from '@mantine/form';
import { 
  TextInput, 
  NumberInput,
  Textarea,
  Button, 
  Stack,
  Select,
  FileInput,
  Avatar,
  Paper,
  Title,
  Alert,
  LoadingOverlay,
  Center,
  Group
} from '@mantine/core';
import { IconAlertCircle, IconUpload } from '@tabler/icons-react';
import { useProfile } from '../hooks/useProfile';
import '@mantine/core/styles/Paper.css';

export function ProfileEdit() {
  const { profile, loading, updateProfile } = useProfile();
  const [imagePreview, setImagePreview] = useState(null);
  
  const form = useForm({
    initialValues: {
      name: '',
      height: null,
      weight: null,
      fitnessLevel: null,
      bio: '',
      profilePicture: null
    },
    validate: {
      name: (value) => (value ? null : 'Name is required'),
      height: (value) => (!value || value > 0 ? null : 'Height must be greater than 0'),
      weight: (value) => (!value || value > 0 ? null : 'Weight must be greater than 0')
    }
  });

  // Cleanup function for object URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle file selection
  const handleFileChange = (file) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    } else {
      setImagePreview(null);
    }

    form.setFieldValue('profilePicture', file);
  };

  useEffect(() => {
    if (profile) {
      form.setValues({
        name: profile.name || '',
        height: profile.profile?.height || null,
        weight: profile.profile?.weight || null,
        fitnessLevel: profile.profile?.fitnessLevel || null,
        bio: profile.profile?.bio || ''
      });
    }
  }, [profile]);

  const handleSubmit = useCallback(async (values) => {
    try {
      const formData = {
        name: values.name,
        profilePicture: values.profilePicture || null,
        profile: {
          height: values.height || null,
          weight: values.weight || null,
          fitnessLevel: values.fitnessLevel || null,
          bio: values.bio || ''
        }
      };

      await updateProfile(formData);
      
      // Clear the preview and file input after successful update
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      form.setFieldValue('profilePicture', null);
      
    } catch (error) {
      console.error('Profile update error:', error);
      form.setErrors({ 
        general: error.message || 'Failed to update profile' 
      });
    }
  }, [updateProfile, form, imagePreview]);

  return (
    <Center>
    <Paper p="md" pos="relative" shadow="xs" style={{ width: 500 }}>
      <LoadingOverlay visible={loading} />
      
      <Title order={2} mb="md">Edit Profile</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {form.errors.general && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {form.errors.general}
            </Alert>
          )}

          <Center>
            <Stack align="center" gap="sm">
              <Avatar
                src={imagePreview || profile?.picture?.url}
                alt={profile?.name || 'Profile picture'}
                size={120}
                radius="xl"
                color="blue"
              >
                {profile?.name ? profile.name.substring(0,2).toUpperCase()  : null}
              </Avatar>
              
              <FileInput
                accept="image/*"
                placeholder="Change picture"
                size="sm"
                leftSection={<IconUpload size={14} />}
                value={form.values.profilePicture}
                onChange={handleFileChange}
                clearable
              />
            </Stack>
          </Center>

          {/* Rest of the form remains the same */}
          <TextInput
            required
            label="Name"
            placeholder="Your name"
            {...form.getInputProps('name')}
          />

          <Group grow>
            <NumberInput
              label="Height (cm)"
              placeholder="Your height"
              min={0}
              {...form.getInputProps('height')}
            />

            <NumberInput
              label="Weight (kg)"
              placeholder="Your weight"
              min={0}
              precision={1}
              {...form.getInputProps('weight')}
            />
          </Group>

          <Select
            label="Fitness Level"
            placeholder="Select your fitness level"
            data={[
              { value: 'BEGINNER', label: 'Beginner' },
              { value: 'INTERMEDIATE', label: 'Intermediate' },
              { value: 'ADVANCED', label: 'Advanced' }
            ]}
            {...form.getInputProps('fitnessLevel')}
          />

          <Textarea
            label="Bio"
            placeholder="Tell us about yourself"
            autosize
            minRows={3}
            {...form.getInputProps('bio')}
          />

          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </Stack>
      </form>
    </Paper>
    </Center>
  );
}
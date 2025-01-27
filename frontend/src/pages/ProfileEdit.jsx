// src/pages/ProfileEdit.jsx
import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { 
  TextInput, 
  NumberInput,
  Textarea,
  Button, 
  Stack,
  Select,
  FileInput,
  Image,
  Paper,
  Title,
  LoadingOverlay 
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useProfile } from '../hooks/useProfile';

export function ProfileEdit() {
  const { profile, loading, updateProfile } = useProfile();
  
  const form = useForm({
    initialValues: {
      username: '',
      name: '',
      height: null,
      weight: null,
      fitnessLevel: '',
      bio: '',
      profilePicture: null
    }
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.setValues({
        username: profile.username || '',
        name: profile.name || '',
        height: profile.profile?.height || null,
        weight: profile.profile?.weight || null,
        fitnessLevel: profile.profile?.fitnessLevel || '',
        bio: profile.profile?.bio || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (values) => {
    try {
      await updateProfile({
        username: values.username,
        name: values.name,
        profilePicture: values.profilePicture,
        profile: {
          height: values.height,
          weight: values.weight,
          fitnessLevel: values.fitnessLevel,
          bio: values.bio
        }
      });

      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red'
      });
    }
  };

  return (
    <Paper p="md" pos="relative">
      <LoadingOverlay visible={loading} overlayBlur={2} />
      
      <Title order={2} mb="md">Edit Profile</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {/* Current profile picture display */}
          {profile?.picture?.url && (
            <Image
              src={profile.picture.url}
              alt="Profile"
              width={120}
              height={120}
              radius="xl"
              mx="auto"
            />
          )}

          <FileInput
            label="Profile Picture"
            accept="image/*"
            {...form.getInputProps('profilePicture')}
          />

          <TextInput
            label="Username"
            placeholder="Your username"
            {...form.getInputProps('username')}
          />

          <TextInput
            label="Name"
            placeholder="Your name"
            {...form.getInputProps('name')}
          />

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
            {...form.getInputProps('bio')}
          />

          <Button type="submit" loading={loading}>
            Save Changes
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
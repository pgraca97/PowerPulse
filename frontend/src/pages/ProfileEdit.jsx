// src/pages/ProfileEdit.jsx
import { useEffect, useCallback } from 'react';
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
  Alert,
  LoadingOverlay 
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useProfile } from '../hooks/useProfile';

export function ProfileEdit() {
  const { profile, loading, error, updateProfile } = useProfile();
  
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

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      console.log('Setting initial form values with profile:', profile);
      form.setValues({
        name: profile.name || '',
        height: profile.profile?.height || null,
        weight: profile.profile?.weight || null,
        fitnessLevel: profile.profile?.fitnessLevel || null,
        bio: profile.profile?.bio || ''
      });
    }
  }, [profile]); // ??????? 

  const handleSubmit = useCallback(async (values) => {
    console.log('Form submitted with values:', values);
    
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

      console.log('Calling updateProfile with data:', formData);
      const result = await updateProfile(formData);
      console.log('Update result:', result);
      
      // Only reset profile picture after successful update
      if (result) {
        form.setFieldValue('profilePicture', null);
      }
      
    } catch (error) {
      console.error('Profile update error:', error);
      form.setErrors({ 
        general: error.message || 'Failed to update profile' 
      });
    }
  }, [updateProfile, form]);

  if (error) {
    console.error('Profile loading error:', error);
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
        Failed to load profile data. Please try again later.
      </Alert>
    );
  }

  return (
    <Paper p="md" pos="relative">
      <LoadingOverlay visible={loading} />
      
      <Title order={2} mb="md">Edit Profile</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {form.errors.general && (
            <Alert icon={<IconAlertCircle size={16} />} color="red">
              {form.errors.general}
            </Alert>
          )}

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
            placeholder="Upload new picture"
            {...form.getInputProps('profilePicture')}
          />

          <TextInput
            required
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
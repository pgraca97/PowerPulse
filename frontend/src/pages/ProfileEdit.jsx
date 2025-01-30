import { useEffect, useCallback, useState } from 'react';
import { useForm } from '@mantine/form';
import { 
  TextInput, 
  NumberInput,
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
  Group,
  Text,
  ActionIcon,
  Divider,
  Flex
} from '@mantine/core';
import { IconAlertCircle, IconUpload, IconTrash, IconPlus } from '@tabler/icons-react';
import { useProfile } from '../hooks/useProfile';
import UserProgressCard from '../components/cards/UserProgressCard';
import { useProgress } from '../hooks/useProgress';
export function ProfileEdit() {
  const { profile, loading, updateProfile } = useProfile();
  const [imagePreview, setImagePreview] = useState(null);
  const { progress } = useProgress();
  
  const form = useForm({
    initialValues: {
      name: '',
      height: null,
      weight: null,
      fitnessLevel: null,
      goals: [],
      profilePicture: null
    },
    validate: {
      name: (value) => (value ? null : 'Name is required'),
      height: (value) => (!value || value > 0 ? null : 'Height must be greater than 0'),
      weight: (value) => (!value || value > 0 ? null : 'Weight must be greater than 0'),
      goals: (value) => (value.length === 0 ? 'At least one goal is required' : null)
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
        goals: profile.profile?.goals || []
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
          goals: values.goals
        }
      };

      await updateProfile(formData);
      
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
    <Center >
       <Flex gap="xl"> 
      <Paper p="xl" pos="relative" shadow="sm" w={700} >
        <LoadingOverlay visible={loading} />
        
        <Title order={2} mb="xl">Edit Profile</Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="lg">
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
                  {profile?.name ? profile.name.substring(0,2).toUpperCase() : null}
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

            <Stack>
              <Text fw={500} size="sm">
                Fitness Goals *
                <Text span c="dimmed" size="xs" fw={400}>
                  {" "}(Add your fitness goals)
                </Text>
              </Text>
              
              {form.values.goals.map((goal, index) => (
                <Group key={index} align="flex-end">
                  <TextInput
                    placeholder={`Goal ${index + 1}`}
                    value={goal}
                    onChange={(e) => form.setFieldValue(`goals.${index}`, e.currentTarget.value)}
                    style={{ flex: 1 }}
                    error={form.errors.goals && index === 0 ? form.errors.goals : null}
                  />
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => form.removeListItem('goals', index)}
                    mb={4}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
              
              <Button
                variant="outline"
                onClick={() => form.insertListItem('goals', '')}
                leftSection={<IconPlus size={16} />}
                size="sm"
              >
                Add Goal
              </Button>
            </Stack>

            <Divider my="lg" />

            <Button type="submit" loading={loading} mt="xl">
              Save Changes
            </Button>
          </Stack>
        </form>
      </Paper>
      <Stack mt="xl" spacing="lg">
      <UserProgressCard progress={progress} />
      </Stack>
      </Flex>
    </Center>
  );
}
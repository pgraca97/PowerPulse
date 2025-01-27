// frontend/src/components/forms/SignupForm.jsx
import React, { useState } from 'react';
import { TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { notifications } from '@mantine/notifications';

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validate: {
      name: (value) => (value.length >= 2 ? null : 'Name must be at least 2 characters'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmPassword: (value, values) => 
        value === values.password ? null : 'Passwords do not match'
    }
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Create user in Firebase
      const { user } = await createUserWithEmailAndPassword(
        auth, 
        values.email, 
        values.password
      );

      // Update profile with name
      await updateProfile(user, {
        displayName: values.name
      });

      notifications.show({
        title: 'Success',
        message: 'Account created successfully',
        color: 'green'
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          required
          label="Name"
          placeholder="Your name"
          {...form.getInputProps('name')}
        />

        <TextInput
          required
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        
        <PasswordInput
          required
          label="Password"
          placeholder="Create a password"
          {...form.getInputProps('password')}
        />

        <PasswordInput
          required
          label="Confirm Password"
          placeholder="Confirm your password"
          {...form.getInputProps('confirmPassword')}
        />

        <Button type="submit" loading={loading}>
          Sign up
        </Button>
      </Stack>
    </form>
  );
}
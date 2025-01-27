// frontend/src/components/forms/LoginForm.jsx
import { useState } from 'react';
import { TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { notifications } from '@mantine/notifications';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters')
    }
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      notifications.show({
        title: 'Success',
        message: 'Logged in successfully',
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
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        
        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
        />

        <Button type="submit" loading={loading}>
          Log in
        </Button>
      </Stack>
    </form>
  );
}
// src/components/forms/SignupForm.jsx
import React from 'react';
import { TextInput, PasswordInput, Button, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSignup } from '../../hooks/useSignup';
import { IconAlertCircle } from '@tabler/icons-react';

export function SignupForm({ onSuccess }) {
  const navigate = useNavigate();
  const { signup, loading } = useSignup();
  
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validate: {
      name: (value) => (value.length >= 2 ? null : 'Name must be at least 2 characters'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email format'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmPassword: (value, values) => 
        value === values.password ? null : 'Passwords do not match'
    }
  });

  const handleSubmit = async (values) => {
    // Clear any previous errors
    form.clearErrors();
    
    const result = await signup({
      email: values.email,
      password: values.password,
      name: values.name
    });

    if (result.success) {
      if (onSuccess) {
        onSuccess();
      }
      navigate('/dashboard');
    } else {
      // Set field-specific errors
      if (result.error === 'email') {
        form.setFieldError('email', result.message);
      } else if (result.error === 'password') {
        form.setFieldError('password', result.message);
      } else {
        // Set general form error
        form.setErrors({ general: result.message });
      }
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        {form.errors.general && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
            {form.errors.general}
          </Alert>
        )}

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

SignupForm.propTypes = {
  onSuccess: PropTypes.func
};
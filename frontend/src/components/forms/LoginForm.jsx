// src/components/forms/LoginForm.jsx
import { TextInput, PasswordInput, Button, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IconAlertCircle } from '@tabler/icons-react';
import { useLogin } from '../../hooks/useLogin';

export function LoginForm({ onSuccess }) {
  const navigate = useNavigate();
  const { login, loading } = useLogin();
  
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email format'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters')
    }
  });

  const handleSubmit = async (values) => {
    form.clearErrors();
    
    const result = await login({
      email: values.email,
      password: values.password
    });

    if (result.success) {
      if (onSuccess) {
        onSuccess();
      }
      navigate('/dashboard');
    } else {
      // Set field-specific or general errors based on the error type
      if (result.error === 'email') {
        form.setFieldError('email', result.message);
      } else if (result.error === 'password') {
        form.setFieldError('password', result.message);
      } else {
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

LoginForm.propTypes = {
  onSuccess: PropTypes.func
};
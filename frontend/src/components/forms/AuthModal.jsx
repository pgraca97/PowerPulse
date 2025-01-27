// frontend/src/components/auth/AuthModal.jsx
import { Modal, Tabs } from '@mantine/core';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import PropTypes from 'prop-types';

export function AuthModal({ opened, onClose, defaultTab = 'login' }) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Welcome to PowerPulse"
      size="md"
      centered
    >
      <Tabs defaultValue={defaultTab}>
        <Tabs.List grow mb="md">
          <Tabs.Tab value="login">Login</Tabs.Tab>
          <Tabs.Tab value="signup">Sign Up</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="login">
          <LoginForm onSuccess={onClose} />
        </Tabs.Panel>

        <Tabs.Panel value="signup">
          <SignupForm onSuccess={onClose} />
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}

AuthModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  defaultTab: PropTypes.oneOf(['login', 'signup'])
};
// src/components/layout/Header/Header.jsx
import { AppShell, Container, Group, Button, Text, Burger } from '@mantine/core';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useProfile } from '../../../hooks/useProfile';
import { useDisclosure } from '@mantine/hooks';
import { AuthModal } from '../../forms/AuthModal';
import PropTypes from 'prop-types';

export function Header({ opened, toggle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const [authOpened, { open: openAuth, close: closeAuth }] = useDisclosure(false);
  const [authType, setAuthType] = useState('login');
  
  const handleAuthClick = (type) => {
    setAuthType(type);
    openAuth();
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <AppShell.Header>
    <Container size="xl" className="h-full">
    <Group justify="space-between" className="h-full">
    <Group>
    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
    <Link to="/" className="no-underline">
    <Text size="xl" fw={700} c="blue">PowerPulse</Text>
    </Link>
    </Group>
    
    <Group>
    {!user ? (
      <>
      <Button variant="subtle" onClick={() => handleAuthClick('login')}>
      Log in
      </Button>
      <Button onClick={() => handleAuthClick('signup')}>
      Sign up
      </Button>
      </>
    ) : (
      <>
      <Link to="/dashboard">
      <Button variant="subtle">Dashboard</Button>
      </Link>
      
      
      
      <Link to="/profile/edit">
      <Button variant="subtle">Profile</Button>
      </Link>
      {profile?.isAdmin && (
        <Link to="/admin">
        <Button variant="filled" color="blue">Admin Panel</Button>
        </Link>
      )}
      <Button onClick={handleLogout} color="red">
      Logout
      </Button>
      </>
    )}
    </Group>
    </Group>
    </Container>
    
    <AuthModal 
    opened={authOpened} 
    onClose={closeAuth} 
    defaultTab={authType} 
    />
    </AppShell.Header>
  );
}

Header.propTypes = {
  opened: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};
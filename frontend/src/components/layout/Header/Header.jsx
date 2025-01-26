// src/components/layout/Header/Header.jsx
import { AppShell, Container, Group, Button, Text, Burger } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
// import { useDisclosure } from '@mantine/hooks';
import PropTypes from 'prop-types';

export function Header({ opened, toggle }) {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

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
            {!isAuthenticated ? (
              <>
                <Button variant="subtle" onClick={() => loginWithRedirect()}>Log in</Button>
                <Button onClick={() => loginWithRedirect({ 
                  authorizationParams: { screen_hint: 'signup' }
                })}>Sign up</Button>
              </>
            ) : (
              <>
                <Link to="/dashboard">
                  <Button variant="subtle">Dashboard</Button>
                </Link>
                <Button onClick={() => logout()}>Logout</Button>
              </>
            )}
          </Group>
        </Group>
      </Container>
    </AppShell.Header>
  );
}

Header.propTypes = {
  opened: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
};

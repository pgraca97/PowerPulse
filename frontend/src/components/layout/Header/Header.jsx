import { AppShell, Container, Group, Button, Text, Burger, Menu, ActionIcon, Indicator, Box } from '@mantine/core';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useProfile } from '../../../hooks/useProfile';
import { useDisclosure } from '@mantine/hooks';
import { AuthModal } from '../../forms/AuthModal';
import { useNotifications } from '../../../hooks/useNotifications';
import { useExerciseSubscription } from '../../../hooks/useExerciseSubscription';
import { IconBell, IconX } from '@tabler/icons-react';
import PropTypes from 'prop-types';

export function Header({ opened, toggle }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const [authOpened, { open: openAuth, close: closeAuth }] = useDisclosure(false);
  const [authType, setAuthType] = useState('login');
  const { 
    notifications, 
    markAsRead, 
    deleteNotification, // Corrigido: agora usando deleteNotification
    unreadCount 
  } = useNotifications();

  // Initialize subscription if user is logged in
  useExerciseSubscription();

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

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.type === 'NEW_EXERCISE') {
      navigate(`/exercise/${notification.data.exerciseId}`);
    }
  };

  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation(); // Previne que o clique se propague para o Menu.Item
    deleteNotification(notificationId);
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

                {/* Notifications Menu */}
                <Menu position="bottom-end" withinPortal>
                  <Menu.Target>
                    <Indicator inline label={unreadCount || 0} size={16} disabled={!unreadCount}>
                      <Box component="span" style={{ display: 'inline-block' }}>
                        <ActionIcon 
                          variant="subtle" 
                          size="lg" 
                          aria-label="Notifications"
                          component="div"
                        >
                          <IconBell style={{ width: '1.2rem', height: '1.2rem' }} />
                        </ActionIcon>
                      </Box>
                    </Indicator>
                  </Menu.Target>

                  <Menu.Dropdown>
                    {notifications.length === 0 ? (
                      <Menu.Item>No notifications</Menu.Item>
                    ) : (
                      notifications.map((notification) => (
                        <Menu.Item
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          rightSection={
                            <ActionIcon
                              size="xs"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteNotification(e, notification.id);
                              }}
                              variant="subtle"
                              color="red"
                            >
                              <IconX size={14} />
                            </ActionIcon>
                          }
                          style={{
                            backgroundColor: notification.read ? undefined : 'var(--mantine-color-blue-0)',
                          }}
                        >
                          <Text size="sm" fw={500}>
                            {notification.title}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {notification.message}
                          </Text>
                        </Menu.Item>
                      ))
                    )}
                  </Menu.Dropdown>
                </Menu>

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
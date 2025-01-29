// src/components/ProtectedRoute.jsx
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile'; 
import { Loader } from '@mantine/core';

export function ProtectedRoute({ component: Component, requireAdmin = false }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isAdmin, loading: profileLoading } = useProfile();

  const loading = authLoading || profileLoading; 

  if (loading) {
    return <Loader size="xl" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />; // Se exigir admin e não for admin, redireciona para home
  }

  return <Component />;
}

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  requireAdmin: PropTypes.bool,
};

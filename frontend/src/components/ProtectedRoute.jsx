// src/components/ProtectedRoute.jsx
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from '@mantine/core';

export function ProtectedRoute({ component: Component }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loader size="xl" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <Component />;
}

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};
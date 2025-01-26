// src/components/ProtectedRoute.jsx
import PropTypes from 'prop-types';
import { withAuthenticationRequired } from '@auth0/auth0-react';

export function ProtectedRoute({ component: Component, ...args }) {
  const WithAuth = withAuthenticationRequired(Component, {
    onRedirecting: () => <div>Loading...</div>,
  });
  
  return <WithAuth {...args} />;
}

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

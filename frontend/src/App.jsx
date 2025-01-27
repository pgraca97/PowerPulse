// frontend/src/App.jsx
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { ApolloProviderWrapper } from './providers/apollo';
import { AppRoutes } from './AppRoutes';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css'; // Add this import

function App() {
  return (
    <MantineProvider>
      <Notifications position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <ApolloProviderWrapper>
            <AppRoutes />
          </ApolloProviderWrapper>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
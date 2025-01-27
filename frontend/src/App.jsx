// frontend/src/App.jsx
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { ApolloProviderWrapper } from './providers/apollo';
import { AppRoutes } from './AppRoutes';
import '@mantine/core/styles.css';

function App() {
  return (
    <MantineProvider>
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
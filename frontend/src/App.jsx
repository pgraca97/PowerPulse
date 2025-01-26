// src/App.jsx
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { Auth0ProviderWithNavigate } from './providers/auth';
import { ApolloProviderWrapper } from './providers/apollo';
import { AppRoutes } from './AppRoutes';
import '@mantine/core/styles.css';

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Auth0ProviderWithNavigate>
          <ApolloProviderWrapper>
            <AppRoutes />
          </ApolloProviderWrapper>
        </Auth0ProviderWithNavigate>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
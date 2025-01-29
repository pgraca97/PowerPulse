// src/App.jsx
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter } from "react-router-dom";
import { ApolloProviderWrapper } from "./providers/apollo";
import { AuthProvider } from "./providers/AuthProvider";
import { AppRoutes } from "./AppRoutes";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster />
      <MantineProvider>
        <Notifications position="top-right" />
        <ApolloProviderWrapper>
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </ApolloProviderWrapper>
      </MantineProvider>
    </>
  );
}

export default App;

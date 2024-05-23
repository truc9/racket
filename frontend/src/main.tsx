import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

const queryClient = new QueryClient();

const theme = createTheme({
  primaryColor: "pink",
  fontFamily: "Inter",
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <Auth0Provider
              domain={import.meta.env.VITE_AUTH0_DOMAIN}
              clientId={import.meta.env.VITE_AUTH0_CLIENTID}
              authorizationParams={{
                redirect_uri: window.location.origin,
              }}
            >
              <App />
            </Auth0Provider>
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

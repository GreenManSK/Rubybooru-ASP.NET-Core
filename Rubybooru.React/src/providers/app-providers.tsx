import React, { PropsWithChildren } from "react";
import { HttpClientProvider } from "./http-client-provider";
import { QueryClientProvider } from "./query-client-provider";
import { ThemeProvider } from "./theme-provider";
import { BrowserRouter as Router } from "react-router-dom";

export const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <HttpClientProvider>
        <QueryClientProvider>
          <Router>{children}</Router>
        </QueryClientProvider>
      </HttpClientProvider>
    </ThemeProvider>
  );
};

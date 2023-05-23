import React, { PropsWithChildren } from "react";
import { HttpClientProvider } from "./http-client-provider";
import { QueryClientProvider } from "./query-client-provider";
import { ThemeProvider } from "./theme-provider";
import { BrowserRouter as Router } from "react-router-dom";
import { FocusModeProvider } from "./focus-mode-provider";
import { TagUtilsProvider } from "./tag-utils-provider";

export const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <HttpClientProvider>
        <QueryClientProvider>
          <TagUtilsProvider>
            <FocusModeProvider>
              <Router>{children}</Router>
            </FocusModeProvider>
          </TagUtilsProvider>
        </QueryClientProvider>
      </HttpClientProvider>
    </ThemeProvider>
  );
};

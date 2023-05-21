import React, { PropsWithChildren } from "react";
import { HttpClientProvider } from "./http-client-provider";
import { QueryClientProvider } from "./query-client-provider";
import { ThemeProvider } from "./theme-provider";

export const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <HttpClientProvider>
        <QueryClientProvider>{children}</QueryClientProvider>
      </HttpClientProvider>
    </ThemeProvider>
  );
};

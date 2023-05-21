import React, { PropsWithChildren } from "react";
import { HttpClientProvider } from "./http-client-provider";
import { QueryClientProvider } from "./query-client-provider";

export const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <HttpClientProvider>
      <QueryClientProvider>{children}</QueryClientProvider>
    </HttpClientProvider>
  );
};

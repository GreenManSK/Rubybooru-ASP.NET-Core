import React, { PropsWithChildren } from "react";
import { HttpClient } from "../utils/http-client";
import { useConfigContext } from "./config-provider";

const HttpClientContext = React.createContext<HttpClient>(null!);

export const HttpClientProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { restUrl } = useConfigContext();
  const httpClient = new HttpClient(restUrl);
  return (
    <HttpClientContext.Provider value={httpClient}>
      {children}
    </HttpClientContext.Provider>
  );
};

export const useHttpClient = () => React.useContext(HttpClientContext);
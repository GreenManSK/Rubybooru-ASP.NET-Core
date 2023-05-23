import React, { PropsWithChildren } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { useConfigContext } from "./config-provider";

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

export const QueryClientProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { queryCacheTime } = useConfigContext();

  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            useErrorBoundary: true,
            refetchOnWindowFocus: false,
            retry(failureCount: number, error: any) {
              if (error.status === 404) return false;
              else if (failureCount < 2) return true;
              else return false;
            },
            cacheTime: queryCacheTime,
            staleTime: queryCacheTime,
          },
        },
      }),
    [queryCacheTime]
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersister,
        maxAge: queryCacheTime,
        buster: localStorage.getItem("cache-buster") ?? "",
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};

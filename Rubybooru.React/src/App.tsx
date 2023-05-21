import React from "react";
import "./App.css";
import { useConfigContext } from "./providers/config-provider";
import { useHttpClient } from "./providers/http-client-provider";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function App() {
  const { isProduction, restUrl } = useConfigContext();
  const client = useHttpClient();
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["images"],
    queryFn: () => client.get("image/?"),
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>
          You are running {isProduction ? "production" : "development"} build.
          <br />
          Your api url is {restUrl}.{" "}
          <button onClick={() => queryClient.resetQueries(["images"])}>
            Delete images cache
          </button>
          <br />
          Data: {JSON.stringify(data)}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

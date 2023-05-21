import React from "react";
import "./App.css";
import { useConfigContext } from "./providers/config-provider";

function App() {
  const { isProduction } = useConfigContext();
  return (
    <div className="App">
      <header className="App-header">
        <p>
          You are running {isProduction ? "production" : "development"} build.
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

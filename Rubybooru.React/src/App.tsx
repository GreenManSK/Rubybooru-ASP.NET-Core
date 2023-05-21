import { useConfigContext } from "./providers/config-provider";
import { useHttpClient } from "./providers/http-client-provider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Box, Link } from "@mui/material";
import {
  sidePanelStyles,
  contentStyles,
  containerStyles,
  headerSidePanelStyles,
  tagsSidePanelStyles,
} from "./App.styles";
import { Logo } from "./components/side/logo";
import { Navigation } from "./components/side/navigation";

function App() {
  const { isProduction, restUrl } = useConfigContext();
  const client = useHttpClient();
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["images"],
    queryFn: () => client.get("image/?"),
  });

  return (
    <Box sx={containerStyles}>
      <Box sx={[sidePanelStyles, headerSidePanelStyles]}>
        <Logo />
        <Navigation />
      </Box>
      <Box sx={[sidePanelStyles, tagsSidePanelStyles]}>Tags</Box>
      <Box sx={contentStyles} component="main">
        <header className="App-header">
          <p>
            You are running {isProduction ? "production" : "development"} build.
            <br />
            Your api url is {restUrl}.{" "}
            <Button
              variant="contained"
              onClick={() => queryClient.resetQueries(["images"])}
            >
              Delete images cache
            </Button>
            <br />
            Data: {JSON.stringify(data)}
          </p>
          <Link
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </Link>
        </header>
      </Box>
    </Box>
  );
}

export default App;

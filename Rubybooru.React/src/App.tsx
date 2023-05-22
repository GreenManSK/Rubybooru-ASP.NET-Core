import { Box } from "@mui/material";
import {
  sidePanelStyles,
  contentStyles,
  containerStyles,
  headerSidePanelStyles,
  tagsSidePanelStyles,
} from "./App.styles";
import { Logo } from "./components/side/logo";
import { Navigation } from "./components/side/navigation";
import { Loader } from "./components/utils/loader";
import React from "react";

const ImageList = React.lazy(
  () => import("./components/image-list/image-list")
);

function App() {
  return (
    <Box sx={containerStyles}>
      <Box sx={[sidePanelStyles, headerSidePanelStyles]}>
        <Logo />
        <Navigation />
      </Box>
      <Box sx={[sidePanelStyles, tagsSidePanelStyles]}>Tags</Box>
      <Box sx={contentStyles} component="main">
        <React.Suspense fallback={<Loader />}>
          <ImageList />
        </React.Suspense>
      </Box>
    </Box>
  );
}

export default App;

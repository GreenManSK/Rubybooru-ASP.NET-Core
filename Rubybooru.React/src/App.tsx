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
import { Routes, Route } from "react-router-dom";

const ImageList = React.lazy(
  () => import("./components/image-list/image-list")
);

const TagList = React.lazy(() => import("./components/tag-list/tag-list"));

function App() {
  return (
    <Box sx={containerStyles}>
      <Box sx={[sidePanelStyles, headerSidePanelStyles]}>
        <Logo />
        <Navigation />
      </Box>
      <Box sx={[sidePanelStyles, tagsSidePanelStyles]}>
        <React.Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/:page" element={<TagList />} />
            <Route path="/" element={<TagList />} />
          </Routes>
        </React.Suspense>
      </Box>
      <Box sx={contentStyles} component="main">
        <React.Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/:page" element={<ImageList />} />
            <Route path="/" element={<ImageList />} />
          </Routes>
        </React.Suspense>
      </Box>
    </Box>
  );
}

export default App;

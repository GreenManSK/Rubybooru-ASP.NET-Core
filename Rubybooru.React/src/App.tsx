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
import { Search } from "./components/side/search";
import { MiscButtons } from "./components/side/misc-buttons";

const SearchImageList = React.lazy(
  () => import("./components/image-list/search-image-list")
);
const SearchTagList = React.lazy(
  () => import("./components/tag-list/search-tag-list")
);

const Image = React.lazy(
  () => import(/* webpackPrefetch: true */ "./components/image/image")
);
const ImageTagList = React.lazy(
  () =>
    import(/* webpackPrefetch: true */ "./components/tag-list/image-tag-list")
);

const UntaggedList = React.lazy(
  () => import("./components/untagged/untagged-list")
);
const UntaggedSidePanel = React.lazy(
  () => import("./components/untagged/untagged-side-panel")
);

const TagManager = React.lazy(() => import("./components/tags/tag-manager"));

const DuplicatesList = React.lazy(
  () => import("./components/duplicates/duplicates-list")
);

function App() {
  return (
    <Box sx={containerStyles}>
      <Box sx={[sidePanelStyles, headerSidePanelStyles]}>
        <Logo />
        <Navigation />
        <Search />
      </Box>
      <Box sx={[sidePanelStyles, tagsSidePanelStyles]}>
        <React.Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/duplicates/:page?" element={<></>} />
            <Route path="/tags/" element={<></>} />
            <Route path="/untagged/:page?" element={<UntaggedSidePanel />} />
            <Route path="image/:id" element={<ImageTagList />} />
            <Route path="/:page?" element={<SearchTagList />} />
          </Routes>
        </React.Suspense>
        <MiscButtons />
      </Box>
      <Box sx={contentStyles} component="main">
        <React.Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/duplicates/:page?" element={<DuplicatesList />} />
            <Route path="/tags/" element={<TagManager />} />
            <Route path="/untagged/:page?" element={<UntaggedList />} />
            <Route path="image/:id" element={<Image />} />
            <Route path="/:page?" element={<SearchImageList />} />
          </Routes>
        </React.Suspense>
      </Box>
    </Box>
  );
}

export default App;

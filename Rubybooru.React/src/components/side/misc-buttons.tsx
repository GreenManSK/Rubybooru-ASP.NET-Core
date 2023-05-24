import { Stack } from "@mui/material";
import { RandomButton } from "./random-button";
import { RefreshCacheButton } from "./refresh-cache-button";
import { FocusModeButton } from "./focus-mode-button";
import { SearchRandomButton } from "./search-random-button";

const boxStyles = {
  textAlign: "center",
  fontSize: "1.2rem",
  marginTop: "1rem",
};

export const MiscButtons = () => (
  <Stack sx={boxStyles}>
    <SearchRandomButton />
    <RandomButton />
    <RefreshCacheButton />
    <FocusModeButton />
  </Stack>
);

import { Stack } from "@mui/material";
import { RandomButton } from "./random-button";

const boxStyles = {
  textAlign: "center",
  fontSize: "1.2rem",
  marginTop: "1rem",
};

export const MiscButtons = () => (
  <Stack sx={boxStyles}>
    <RandomButton />
  </Stack>
);

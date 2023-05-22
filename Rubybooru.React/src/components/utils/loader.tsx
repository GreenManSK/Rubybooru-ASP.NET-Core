import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

const loaderStyles = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const Loader = () => (
  <Box sx={loaderStyles}>
    <CircularProgress />
  </Box>
);

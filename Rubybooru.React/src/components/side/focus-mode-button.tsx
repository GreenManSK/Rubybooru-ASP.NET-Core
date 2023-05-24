import { Box, Switch, FormControlLabel, Theme } from "@mui/material";
import { useFocusMode } from "../../providers/focus-mode-provider";
import { useMatch } from "react-router";

const formControlLabelStyles = {
  typography: {
    sx: (theme: Theme) => ({
      fontSize: "1.2rem",
      color: theme.palette.primary.main,
    }),
  },
};

const fullscreenBoxStyles = {
  position: "absolute",
  top: 0,
  right: 0,
  zIndex: 5000,
};

export const FocusModeButton = () => {
  const { isFocusModeSet, isFullscreen, setIsFocusMode } = useFocusMode();

  const isOnImage = !!useMatch("image/:id");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFocusMode(e.target.checked);
  };

  return (
    <Box
      sx={
        isOnImage && isFocusModeSet && !isFullscreen ? fullscreenBoxStyles : {}
      }
    >
      <FormControlLabel
        componentsProps={formControlLabelStyles}
        label="Focus mode"
        control={<Switch checked={isFocusModeSet} onChange={onChange} />}
      />
    </Box>
  );
};

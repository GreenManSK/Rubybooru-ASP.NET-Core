import { TextField } from "@mui/material";
import React from "react";

export const inputStyles = {
  fontSize: "1.1rem",
  padding: "0.5rem 1rem",
};

export const InputTextField = (
  props: React.ComponentProps<typeof TextField>
) => {
  return (
    <TextField
      placeholder="kurosawa_ruby"
      size="small"
      fullWidth
      color="primary"
      variant="filled"
      inputProps={{
        sx: inputStyles,
      }}
      {...props}
    />
  );
};

import { CssBaseline } from "@mui/material";
import {
  ThemeOptions,
  ThemeProvider as MaterialThemeProvider,
  createTheme,
} from "@mui/material/styles";
import React, { PropsWithChildren } from "react";

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#fe728b",
    },
    secondary: {
      main: "#973363",
    },
    text: {
      primary: "#fe728b",
      secondary: "rgba(254,114,139,0.7)",
      disabled: "rgba(254,114,139,0.5)",
    },
  },
  typography: {
    htmlFontSize: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontSize: "62.5%",
        },
        body: {
          backgroundColor: "background.default",
        },
      },
    },
  },
};

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const theme = createTheme(themeOptions);
  return (
    <MaterialThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MaterialThemeProvider>
  );
};

import { mobileMediaQuery } from "./styles.constants";

const menuWidth = "330px";
const contentPadding = "2rem";

export const containerStyles = {
  padding: "0 1rem",
  [mobileMediaQuery]: {
    display: "flex",
    flexDirection: "column",
  },
};

export const sidePanelStyles = {
  width: menuWidth,
  float: "left",
  clear: "both",
  [mobileMediaQuery]: {
    float: "initial",
    width: "100%",
    padding: "0 1rem 1rem",
  },
};

export const headerSidePanelStyles = {
  [mobileMediaQuery]: {
    order: 0,
  },
};

export const tagsSidePanelStyles = {
  [mobileMediaQuery]: {
    order: 2,
  },
};

export const contentStyles = {
  width: `calc(100% - ${menuWidth})`,
  marginLeft: menuWidth,
  padding: contentPadding,
  position: "relative",
  [mobileMediaQuery]: {
    width: "100%",
    marginLeft: 0,
    order: 1,
    padding: 0,
  },
};

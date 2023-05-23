import { Theme } from "@mui/material";
import { TagType } from "./entities/tag";

export const mobileMediaQuery =
  "@media (orientation: portrait), (max-width: 900px), (max-height: 800px)";

export const hiddenStyle = {
  display: "none",
};

export const tagColors = {
  [TagType.Author]: "#bd2130",
  [TagType.Character]: "#0A0",
  [TagType.System]: "#FF2020",
  [TagType.Copyright]: "#D0D",
};

export const tagTextStyles = {
  [TagType.General]: (theme: Theme) => ({
    color: theme.palette.primary.main,
  }),
  [TagType.Author]: () => ({ color: tagColors[TagType.Author] }),
  [TagType.Character]: () => ({ color: tagColors[TagType.Character] }),
  [TagType.System]: () => ({ color: tagColors[TagType.System] }),
  [TagType.Copyright]: () => ({ color: tagColors[TagType.Copyright] }),
};

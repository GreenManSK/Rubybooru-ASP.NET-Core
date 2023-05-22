import { Box, Link, Typography, Theme } from "@mui/material";
import { ITag } from "../../entities/tag";
import LabelIcon from "@mui/icons-material/Label";
import { mobileMediaQuery, tagTextStyles } from "../../styles.constants";

export interface ITagProps {
  tag: ITag;
}

// TODO: Navigation

const boxStyles = {
  padding: 0,
  margin: 0,
  lineHeight: 1.2,
};

const textStyles = {
  fontSize: "1.2rem",
  [mobileMediaQuery]: {
    fontSize: "1.4rem",
  },
};

const iconStyles = {
  verticalAlign: "text-bottom",
  marginRight: ".5rem",
  fontSize: "1.5rem",
  [mobileMediaQuery]: {
    fontSize: "2rem",
  },
};

const numberStyles = (theme: Theme) => ({
  color: theme.palette.text.primary,
});

export const Tag = ({ tag }: ITagProps) => (
  <Box component="li" sx={boxStyles}>
    <Link href="#tag" sx={[textStyles, tagTextStyles[tag.type]]}>
      <LabelIcon sx={iconStyles} />
      {tag.name}
      {tag.count ? (
        <Typography component="span" sx={[textStyles, numberStyles]}>
          {" "}
          ({tag.count})
        </Typography>
      ) : null}
    </Link>
  </Box>
);

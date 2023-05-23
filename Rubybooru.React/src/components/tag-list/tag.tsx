import { Box, Typography, Theme, Link as MaterialLink } from "@mui/material";
import { ITag, TagType } from "../../entities/tag";
import LabelIcon from "@mui/icons-material/Label";
import { mobileMediaQuery, tagTextStyles } from "../../styles.constants";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import styled from "@emotion/styled";
import { getTagsToLink } from "../../utils/navigation-helpers";
import { SvgIconComponent } from "@mui/icons-material";

export interface ITagButtonProps {
  Icon: SvgIconComponent;
  label: string;
  onClick: (tag: ITag) => void;
}

export interface ITagProps {
  tag: ITag;
  button?: ITagButtonProps;
}

const boxStyles = {
  padding: 0,
  margin: 0,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
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

const Link = styled(RouterLink, {
  shouldForwardProp: (prop) => prop !== "tagType",
})<LinkProps & { tagType: TagType }>((props) => {
  const tagStyle = tagTextStyles[props.tagType];
  return { ...textStyles, ...tagStyle(props.theme as unknown as any) };
});

export const Tag = ({ tag, button }: ITagProps) => {
  return (
    <Box component="li" sx={boxStyles}>
      <Link tagType={tag.type} to={getTagsToLink(tag)} title={tag.name}>
        <LabelIcon sx={iconStyles} />
        {tag.name}
        {tag.count ? (
          <Typography component="span" sx={[textStyles, numberStyles]}>
            {" "}
            ({tag.count})
          </Typography>
        ) : null}
      </Link>
      {button && (
        <MaterialLink
          href="#"
          sx={textStyles}
          title={button.label}
          onClick={() => button.onClick(tag)}
        >
          <button.Icon sx={iconStyles} />
        </MaterialLink>
      )}
    </Box>
  );
};

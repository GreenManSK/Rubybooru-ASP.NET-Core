import { Box, Typography, Theme, Link as MaterialLink } from "@mui/material";
import { ITag, TagType } from "../../entities/tag";
import LabelIcon from "@mui/icons-material/Label";
import { mobileMediaQuery, tagTextStyles } from "../../styles.constants";
import { Link as RouterLink, LinkProps } from "react-router-dom";
import styled from "@emotion/styled";
import { getTagsToLink } from "../../utils/navigation-helpers";
import { SvgIconComponent } from "@mui/icons-material";
import React, { PropsWithChildren } from "react";

export interface ITagProps {
  tag: ITag;
  button?: ITagButtonProps;
  TagElement?: React.ComponentType<PropsWithChildren>;
  onTagClick?: (tag: ITag) => void;
}

export interface ITagButtonProps {
  Icon: SvgIconComponent;
  label: string;
  onClick: (tag: ITag) => void;
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

interface ITagLinkProps {
  tag: ITag;
  onTagClick?: (tag: ITag) => void;
}

const TagLink: React.FC<PropsWithChildren<ITagLinkProps>> = ({
  tag,
  onTagClick,
  children,
}) => {
  if (onTagClick) {
    const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      onTagClick(tag);
    };
    return (
      <MaterialLink
        title={tag.name}
        href="#"
        onClick={onClick}
        sx={[textStyles, tagTextStyles[tag.type]]}
      >
        {children}
      </MaterialLink>
    );
  }
  return (
    <Link tagType={tag.type} to={getTagsToLink(tag)} title={tag.name}>
      {children}
    </Link>
  );
};

export const Tag = ({ tag, button, TagElement, onTagClick }: ITagProps) => {
  const Container = TagElement ?? DefaultContainer;
  return (
    <Container>
      <TagLink tag={tag} onTagClick={onTagClick}>
        <LabelIcon sx={iconStyles} />
        {tag.name}
        {tag.count && tag.count > 0 ? (
          <Typography component="span" sx={[textStyles, numberStyles]}>
            {" "}
            ({tag.count})
          </Typography>
        ) : null}
      </TagLink>
      {button && (
        <MaterialLink
          href="#"
          sx={textStyles}
          title={button.label}
          onClick={(e) => {
            e.preventDefault();
            button.onClick(tag);
          }}
        >
          <button.Icon sx={iconStyles} />
        </MaterialLink>
      )}
    </Container>
  );
};

const DefaultContainer: React.FC<PropsWithChildren> = ({ children }) => (
  <Box component="li" sx={boxStyles}>
    {children}
  </Box>
);

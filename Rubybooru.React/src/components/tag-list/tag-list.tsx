import { Skeleton, Box, Grid } from "@mui/material";
import { ITag } from "../../entities/tag";
import { useConfigContext } from "../../providers/config-provider";
import React, { PropsWithChildren } from "react";
import { ITagButtonProps, Tag } from "./tag";
import { mobileMediaQuery } from "../../styles.constants";
import { useNormalizedTags } from "../../utils/tags";

const ulStyles = {
  clear: "both",
  listStyle: "none",
  padding: ".5rem 0 0 1rem",
  margin: 0,
  [mobileMediaQuery]: {
    margin: ".5rem 0 0 0",
  },
};

interface ITagListProps {
  isLoading: boolean;
  tags?: ITag[];
  button?: ITagButtonProps;
  ContainerElement?: React.ComponentType<PropsWithChildren>;
  TagElement?: React.ComponentType<PropsWithChildren>;
  onTagClick?: (tag: ITag) => void;
}

const TagList = ({
  tags,
  isLoading,
  button,
  ContainerElement,
  TagElement,
  onTagClick
}: ITagListProps) => {
  const { tagTypeOrder } = useConfigContext();

  const normalizedTags = useNormalizedTags(tags);

  const sortedTags = React.useMemo(
    () =>
      normalizedTags
        ? normalizedTags.sort((a: any, b: any) => {
            if (a.type === b.type) {
              return b.count - a.count;
            }
            return tagTypeOrder.indexOf(a.type) < tagTypeOrder.indexOf(b.type)
              ? -1
              : 1;
          })
        : [],
    [normalizedTags, tagTypeOrder]
  );

  if (isLoading) return <TagListSkeleton />;

  const Container = ContainerElement ?? DefaultContainer;

  return (
    <Container>
      {sortedTags.map((tag) => (
        <Tag tag={tag} key={tag.id} button={button} TagElement={TagElement} onTagClick={onTagClick} />
      ))}
    </Container>
  );
};

const DefaultContainer: React.FC<PropsWithChildren> = ({ children }) => (
  <Box component="ul" sx={ulStyles}>
    {children}
  </Box>
);

const TagListSkeleton = () => (
  <>
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </>
);

export default TagList;

import { Skeleton, Box } from "@mui/material";
import { ITag } from "../../entities/tag";
import { useConfigContext } from "../../providers/config-provider";
import React from "react";
import { Tag } from "./tag";
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
}

const TagList = ({ tags, isLoading }: ITagListProps) => {
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

  return (
    <Box component="ul" sx={ulStyles}>
      {sortedTags.map((tag) => (
        <Tag tag={tag} key={tag.id} />
      ))}
    </Box>
  );
};

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

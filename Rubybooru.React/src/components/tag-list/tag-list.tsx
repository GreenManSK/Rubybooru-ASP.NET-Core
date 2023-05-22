import { Skeleton, Box } from "@mui/material";
import { ITag, TagType } from "../../entities/tag";
import { useConfigContext } from "../../providers/config-provider";
import React from "react";
import { Tag } from "./tag";
import { mobileMediaQuery } from "../../styles.constants";
import { useTags } from "../../queries/tags";
import { useParams } from "react-router-dom";
import { useImages } from "../../queries/images";

const ulStyles = {
  clear: "both",
  listStyle: "none",
  padding: ".5rem 0 0 1rem",
  margin: 0,
  [mobileMediaQuery]: {
    margin: ".5rem 0 0 0",
  },
};

const TagList = () => {
  const { tagTypeOrder, imagesPerPage, displayTagCount } = useConfigContext();
  // TODO: Unify between ImageList
  const { page: pageParam = "1" } = useParams();
  const page = parseInt(pageParam);
  const options = { imagesPerPage, page };
  const { data: images } = useImages(options);

  const { isLoading, data } = useTags(images?.map((i) => i.id) ?? [], {
    enabled: !!images,
  });
  const tags = React.useMemo(() => {
    if (!data) return [];
    const tags = {} as { [key: number]: ITag };

    for (const imageTags of Object.values<ITag[]>(data)) {
      for (const tag of imageTags) {
        if (tags[tag.id]) {
          tags[tag.id].count += 1;
        } else {
          tag.count = 1;
          tags[tag.id] = tag;
        }
      }
    }

    let result = Array.from(Object.values(tags));
    result.sort((a, b) => b.count - a.count);

    result = result.slice(0, displayTagCount);
    return result;
  }, [data, displayTagCount]);

  const sortedTags = React.useMemo(
    () =>
      tags.sort((a: any, b: any) => {
        if (a.type === b.type) {
          return b.count - a.count;
        }
        return tagTypeOrder.indexOf(a.type) < tagTypeOrder.indexOf(b.type)
          ? -1
          : 1;
      }),
    [tags, tagTypeOrder]
  );

  if (isLoading) return <TagListSkeleton />;

  return (
    <Box component="ul" sx={ulStyles}>
      {sortedTags.map((tag) => (
        <Tag tag={tag} />
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

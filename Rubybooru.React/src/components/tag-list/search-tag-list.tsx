import { ITag } from "../../entities/tag";
import { useConfigContext } from "../../providers/config-provider";
import React from "react";
import { useTags } from "../../queries/tags";
import { useParams } from "react-router-dom";
import { useImages } from "../../queries/images";
import TagList from "./tag-list";

const SearchTagList = () => {
  const { imagesPerPage, displayTagCount } = useConfigContext();
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

  return <TagList tags={tags} isLoading={isLoading} />;
};

export default SearchTagList;

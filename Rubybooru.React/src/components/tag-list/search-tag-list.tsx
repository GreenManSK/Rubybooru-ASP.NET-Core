import { ITag } from "../../entities/tag";
import { useConfigContext } from "../../providers/config-provider";
import React from "react";
import { useImagesTags } from "../../queries/tags";
import TagList from "./tag-list";
import { useSearchImages } from "../../utils/images";

const SearchTagList = () => {
  const { displayTagCount } = useConfigContext();

  const images = useSearchImages();

  const { isLoading, data } = useImagesTags(images?.map((i) => i.id) ?? [], {
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

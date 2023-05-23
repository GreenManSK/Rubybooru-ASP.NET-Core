import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useTagUtils } from "../providers/tag-utils-provider";
import React from "react";
import { ITag } from "../entities/tag";

export const SEARCH_TAG_KEY = "tags";
export const useSearchTags = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { inputParser } = useTagUtils();

  const searchTags = React.useMemo(() => {
    const tags = searchParams.getAll(SEARCH_TAG_KEY);
    return tags
      .map((x) => inputParser.getEntity(x))
      .filter((x) => x !== undefined) as ITag[];
  }, [searchParams, inputParser]);

  const setSearchTags = React.useCallback(
    (tags: ITag[]) => {
      navigate(getTagsToLink(tags));
    },
    [navigate]
  );

  return [searchTags, setSearchTags] as const;
};

export const getTagsToLink = (tag: ITag | ITag[]) => {
  const tagNames = Array.isArray(tag) ? tag.map((x) => x.name) : [tag.name];
  return {
    pathname: "/",
    search: createSearchParams({ [SEARCH_TAG_KEY]: tagNames }).toString(),
  };
};

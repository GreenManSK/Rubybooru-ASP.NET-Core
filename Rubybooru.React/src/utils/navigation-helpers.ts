import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useTagUtils } from "../providers/tag-utils-provider";
import React from "react";
import { ITag } from "../entities/tag";

export const SEARCH_TAG_KEY = "tags";
export const UNTAGGED_YEAR_KEY = "year";

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

export const useUntaggedYear = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const year = parseInt(searchParams.get(UNTAGGED_YEAR_KEY) ?? "");

  const setYear = React.useCallback(
    (year: number) => {
      if (year !== 0) {
        searchParams.set(UNTAGGED_YEAR_KEY, year.toString());
      } else {
        searchParams.delete(UNTAGGED_YEAR_KEY);
      }
      setSearchParams(searchParams);
    },
    [setSearchParams, searchParams]
  );

  return [!isNaN(year) ? year : undefined, setYear] as const;
};

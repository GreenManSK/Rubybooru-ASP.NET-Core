import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useTagUtils } from "../providers/tag-utils-provider";
import React from "react";
import { ITag } from "../entities/tag";
import { ISizeCondition } from "../entities/size-condition";

export const SEARCH_TAG_KEY = "tags";
export const SIZE_CONDITION_KEY = "size";
export const UNTAGGED_YEAR_KEY = "year";

export const useImageSearchParams = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { inputParser } = useTagUtils();

  const data = React.useMemo(() => {
    const tags = searchParams.getAll(SEARCH_TAG_KEY);
    const sizeConditions = searchParams
      .getAll(SIZE_CONDITION_KEY)
      .filter((x) => x);
    return {
      tags: tags
        .map((x) => inputParser.getEntity(x))
        .filter((x) => x !== undefined) as ITag[],
      sizeConditions: sizeConditions.map(
        (x) => JSON.parse(x) as ISizeCondition
      ),
    };
  }, [searchParams, inputParser]);

  const setSearchParams = React.useCallback(
    (data: { tags: ITag[]; sizeConditions: ISizeCondition[] }) => {
      navigate(getTagsToLink(data.tags, data.sizeConditions));
    },
    [navigate]
  );

  return [data, setSearchParams] as const;
};

export const getTagsToLink = (
  tag: ITag | ITag[],
  sizeConditions?: ISizeCondition[]
) => {
  const tagNames = Array.isArray(tag) ? tag.map((x) => x.name) : [tag.name];
  const serializedSizeConditions =
    sizeConditions && sizeConditions.length > 0
      ? sizeConditions.map((s) => JSON.stringify(s))
      : "";

  const params: any = {
    [SEARCH_TAG_KEY]: tagNames,
  };
  if (serializedSizeConditions) {
    params[SIZE_CONDITION_KEY] = serializedSizeConditions;
  }

  return {
    pathname: "/",
    search: createSearchParams(params).toString(),
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

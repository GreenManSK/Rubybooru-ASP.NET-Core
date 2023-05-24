import React from "react";
import { SearchBar, splitValue } from "./search-bar";
import { useTagUtils } from "../../providers/tag-utils-provider";
import { useImageSearchParams } from "../../utils/navigation-helpers";
import { ISizeCondition } from "../../entities/size-condition";
import { AdvancedSearchForm } from "./advanced-search-form";

interface ISearchProps {
  isAdvancedSearch: boolean;
  setIsAdvancedSearch: (isAdvancedSearch: boolean) => void;
}

export const Search = ({
  isAdvancedSearch,
  setIsAdvancedSearch,
}: ISearchProps) => {
  const [value, setValue] = React.useState("");
  const [sizeConditions, setSizeConditions] = React.useState<ISizeCondition[]>(
    []
  );

  const [
    { tags: searchTags, sizeConditions: urlSizeConditions },
    setSearchParams,
  ] = useImageSearchParams();
  const { inputParser } = useTagUtils();

  React.useEffect(() => {
    const tags = searchTags.map((tag) => tag.name).join(" ");
    setValue(tags ? `${tags} ` : "");
  }, [searchTags]);

  React.useEffect(() => {
    setSizeConditions(urlSizeConditions);
    if (urlSizeConditions.length === 0) return;
    setIsAdvancedSearch(true);
  }, [urlSizeConditions, setIsAdvancedSearch]);

  const submit = React.useCallback(() => {
    const tags = inputParser.parse(splitValue(value));
    setSearchParams({
      tags,
      sizeConditions: isAdvancedSearch ? sizeConditions : [],
    });
  }, [value, inputParser, setSearchParams, sizeConditions, isAdvancedSearch]);

  return (
    <>
      <SearchBar value={value} setValue={setValue} submit={submit} />
      {isAdvancedSearch && (
        <AdvancedSearchForm
          sizeConditions={sizeConditions}
          setSizeConditions={setSizeConditions}
          submit={submit}
        />
      )}
    </>
  );
};

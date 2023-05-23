import React from "react";
import { SearchBar, splitValue } from "./search-bar";
import { useTagUtils } from "../../providers/tag-utils-provider";
import { useSearchTags } from "../../utils/navigation-helpers";

export const Search = () => {
  const [value, setValue] = React.useState("");

  const [searchTags, setSearchTags] = useSearchTags();
  const { inputParser } = useTagUtils();

  React.useEffect(() => {
    const tags = searchTags.map((tag) => tag.name).join(" ");
    setValue(tags ? `${tags} ` : "");
  }, [searchTags]);

  const submit = React.useCallback(() => {
    const tags = inputParser.parse(splitValue(value));
    setSearchTags(tags);
  }, [value, inputParser, setSearchTags]);

  return <SearchBar value={value} setValue={setValue} submit={submit} />;
};

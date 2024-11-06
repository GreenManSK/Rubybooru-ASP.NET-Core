import React from "react";
import { ITag } from "../entities/tag";

export const useNormalizedTags = (tags?: ITag[]) =>
  React.useMemo(() => {
    if (!tags) return tags;
    return tags.map((tag) =>
      tag.name.indexOf("&") !== -1
        ? { ...tag, normalizedName: normalizeTagName(tag.name) }
        : tag
    );
  }, [tags]);

const helperTextElement = document.createElement("textarea");
export const normalizeTagName = (name: string, checkIfNeeded = false) => {
  if (checkIfNeeded && name.indexOf("&") === -1) return name;
  helperTextElement.innerHTML = name;
  return helperTextElement.value;
};

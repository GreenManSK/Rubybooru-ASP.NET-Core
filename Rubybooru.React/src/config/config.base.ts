import { TagType } from "../entities/tag";

export const configBase = {
  imagesPerPage: 48,
  tagTypeOrder: [
    TagType.Copyright,
    TagType.Character,
    TagType.Author,
    TagType.General,
    TagType.System,
  ],
  displayTagCount: 20,
};

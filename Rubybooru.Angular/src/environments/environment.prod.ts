import { TagType } from '../app/entities/tag-type.enum';

export const environment = {
  production: true,
  restUrl: 'http://localhost:8080/api/',

  imagesPerPage: 48,
  defaultPaginationSize: 7,
  displayTagCount: 20,
  cacheTimeInMins: 24 * 60,
  stateCacheLimit: 20,

  whispererTagLimit: 10,
  whispererUsedTags: [TagType.Copyright, TagType.Character, TagType.Author, TagType.General, TagType.System],

  tagTypeOrder: [
    TagType.Copyright,
    TagType.Character,
    TagType.Author,
    TagType.General,
    TagType.System
  ]
};

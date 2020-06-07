import { TagType } from '../app/entities/tag-type.enum';

export const environment = {
  production: true,
  restUrl: 'http://localhost/',

  imagesPerPage: 24,
  defaultPaginationSize: 7,
  displayTagCount: 20,
  cacheTimeInMins: 60,

  tagTypeOrder: [
    TagType.Copyright,
    TagType.Character,
    TagType.General,
    TagType.System
  ]
};

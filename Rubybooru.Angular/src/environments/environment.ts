// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { TagType } from '../app/entities/tag-type.enum';

export const environment = {
  production: false,
  restUrl: 'https://localhost:44397/api/',

  imagesPerPage: 24,
  defaultPaginationSize: 7,
  displayTagCount: 20,
  cacheTimeInMins: 1,

  whispererTagLimit: 10,
  whispererUsedTags: [TagType.Copyright, TagType.Character, TagType.General],

  tagTypeOrder: [
    TagType.Copyright,
    TagType.Character,
    TagType.General,
    TagType.System
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

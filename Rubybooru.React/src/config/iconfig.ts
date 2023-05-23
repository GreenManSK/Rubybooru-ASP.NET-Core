import { TagType } from "../entities/tag";

export interface IConfig {
  isProduction: boolean;
  restUrl: string;
  queryCacheTime: number;

  imagesPerPage: number;
  tagTypeOrder: TagType[];
  displayTagCount: number;

  tagWhispererLimit: number;
  tagAddingWhispererLimit: number;
}

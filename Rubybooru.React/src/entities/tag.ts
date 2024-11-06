export enum TagType {
  General,
  Character,
  System,
  Copyright,
  Author,
}

export interface ITag {
  id: number;
  name: string;
  normalizedName?: string;
  type: TagType;
  userCreated: boolean;
  count: number;
}

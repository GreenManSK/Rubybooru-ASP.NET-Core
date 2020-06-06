import { TagType } from './tag-type.enum';

export class Tag {
  Id: number;
  Name: string;
  Type: TagType;
  UserCreated: boolean;
  Count: number;
}

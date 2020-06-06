import { TagType } from './tag-type.enum';

export class Tag {
  id: number;
  name: string;
  type: TagType;
  userCreated: boolean;
  count: number;
}

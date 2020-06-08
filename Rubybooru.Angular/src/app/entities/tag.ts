import { TagType } from './tag-type.enum';

export class Tag {
  id: number;
  name: string;
  type: TagType = 0;
  userCreated: boolean;
  count: number;

  constructor( id: number, name: string, userCreated: boolean = true ) {
    this.id = id;
    this.name = name;
  }
}

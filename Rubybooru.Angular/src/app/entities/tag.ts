import { TagType } from './tag-type.enum';

export class Tag {
  id: number;
  name: string;
  type: TagType;
  userCreated: boolean;
  count: number;


  constructor( id: number, name: string ) {
    this.id = id;
    this.name = name;
  }
}

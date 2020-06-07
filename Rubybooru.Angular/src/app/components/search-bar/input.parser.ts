import { Tag } from '../../entities/tag';

export class InputParser {
  private tags: Tag[];

  constructor( values: string[], nameToId: { [p: string]: number } ) {
    this.parse(values, nameToId);
  }

  private parse( values: string[], nameToId: object ): void {
    this.tags = [];

    if (values.length === 0) {
      return null;
    }
    for (const v of values) {
      if (nameToId.hasOwnProperty(v)) {
        this.tags.push(new Tag(nameToId[v], v));
      }
    }
  }

  public getTags(): Tag[] {
    return this.tags;
  }
}

import { Tag } from '../../entities/tag';

export class WhispererTag {
  public readonly tag: Tag;
  private readonly words: string[];

  constructor( tag: Tag ) {
    this.tag = tag;
    this.words = this.getWords(tag.name);
  }

  public match( prefix: string ): boolean {
    for (const word of this.words) {
      if (word.startsWith(prefix)) {
        return true;
      }
    }
    return false;
  }

  private getWords( name: string ): string[] {
    const words = name.split('_');
    words.push(name);
    return words;
  }
}

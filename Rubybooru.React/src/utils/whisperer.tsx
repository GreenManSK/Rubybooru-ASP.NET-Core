import React from "react";

type Entity = { name: string };

function normalize(name: string): string {
  return name.replaceAll(/[^\w_]/g, "");
}

export class WhispererEntity<T extends Entity> {
  public readonly entity: T;
  private readonly words: string[];

  public constructor(entity: T) {
    this.entity = entity;
    this.words = this.getWords(entity.name);
  }

  public match(prefix: string): boolean {
    for (const word of this.words) {
      if (word.startsWith(prefix)) {
        return true;
      }
    }
    return false;
  }

  public highlightMatch(prefix: string) {
    const words = this.words.map((word, key) => (
      <React.Fragment key={key}>
        {key !== 0 ? "_" : ""}
        {word.startsWith(prefix) ? <strong>{word}</strong> : word}
      </React.Fragment>
    ));
    words.pop();
    return words;
  }

  private getWords(name: string): string[] {
    const words = normalize(name).split("_");
    words.push(name);
    return words;
  }
}

export class Whisperer<T extends Entity> {
  private readonly entities: WhispererEntity<T>[];
  private readonly entityComparer: (a: T, b: T) => number;

  public constructor(entities: T[], entityComparer: (a: T, b: T) => number) {
    this.entityComparer = entityComparer;
    this.entities = entities
      .sort(entityComparer)
      .map((entity) => new WhispererEntity(entity));
  }

  public whisper(prefix: string, limit: number): WhispererEntity<T>[] {
    prefix = normalize(prefix);
    const matches: WhispererEntity<T>[] = [];
    for (const entity of this.entities) {
      if (entity.match(prefix)) {
        matches.push(entity);
        if (matches.length >= limit) {
          break;
        }
      }
    }
    return matches;
  }
}

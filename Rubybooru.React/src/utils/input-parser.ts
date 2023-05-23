type Entity = { id: number; name: string };

export class InputParser<T extends Entity> {
  private nameToEntity: Map<string, T>;

  public constructor(entities: T[]) {
    this.nameToEntity = new Map(entities.map((x) => [x.name, x]));
  }

  public parse(values: string[]): T[] {
    const result: T[] = [];

    for (const value of values) {
      const entity = this.nameToEntity.get(value);
      if (entity) {
        result.push(entity);
      }
    }

    return result;
  }

  public getEntity(name: string): T | undefined {
    return this.nameToEntity.get(name);
  }
}

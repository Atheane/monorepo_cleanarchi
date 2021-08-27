import { QueryService } from '@oney/common-core';
import { injectable } from 'inversify';

@injectable()
export class InMemoryQueryService implements QueryService {
  constructor(private readonly store: Map<string, any>) {}

  findOne<T>(predicate: { [p: string]: any }): Promise<T> {
    return this.store.get(Object.values(predicate)[0]);
  }

  find<T>(predicate: { [p: string]: any }): Promise<T[]> {
    const map = this.store;
    const foundItems = [];
    for (const [key, value] of map.entries()) {
      if (JSON.stringify({ [key]: value }) === JSON.stringify(predicate)) {
        foundItems.push({ [key]: value });
      }
    }
    return Promise.resolve(foundItems);
  }
}

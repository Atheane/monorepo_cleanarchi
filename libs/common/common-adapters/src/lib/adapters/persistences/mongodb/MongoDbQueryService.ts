import { QueryService } from '@oney/common-core';
import { injectable } from 'inversify';
import * as mongoose from 'mongoose';

@injectable()
export class MongoDbQueryService implements QueryService {
  private readonly _collection: mongoose.Collection;

  constructor(collection: mongoose.Collection) {
    this._collection = collection;
  }

  async findOne<T>(predicate: { [p: string]: any }): Promise<T> {
    return await this._collection.findOne(predicate);
  }

  async find<T>(predicate: { [p: string]: any }): Promise<T[]> {
    const results = await this._collection.find(predicate);
    return results.toArray();
  }
}

import { QueryService } from '@oney/common-core';
import { injectable } from 'inversify';
import * as mongoose from 'mongoose';
import { Collection } from 'mongoose';

/* istanbul ignore next */ @injectable()
export class MongoDbQueryService implements QueryService {
  collection: Collection;

  constructor(dbConnectionUrl: string, collection: string, database: string) {
    this.collection = mongoose
      .createConnection(dbConnectionUrl, { useNewUrlParser: true })
      .useDb(database)
      .collection(collection);
  }

  findOne<T>(predicate: { [p: string]: any }): Promise<T> {
    return this.collection.findOne(predicate);
  }
  async find<T>(predicate: { [key: string]: unknown }): Promise<T[]> {
    const results = await this.collection.find(predicate);
    return results.toArray();
  }
}

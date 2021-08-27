import { WriteService } from '@oney/payment-core'; // No tested in unit testing.
import { injectable } from 'inversify';
import * as mongoose from 'mongoose';
import { Collection } from 'mongoose';

/* istanbul ignore next */ @injectable()
export class MongoDbWriteService implements WriteService {
  collection: Collection;

  constructor(dbConnectionUrl: string, collection: string, database: string) {
    this.collection = mongoose
      .createConnection(dbConnectionUrl, { useNewUrlParser: true })
      .useDb(database)
      .collection(collection);
  }

  // Required until we setup the proper Mongoose Schemas for the new models
  private findOneAndUpdate<T>(predicate: { [p: string]: any }, data: T): Promise<T> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - the _id field is managed by mongodb, overriding it or setting it explicitly makes mongo reject the action
      delete data._id;
      this.collection.findOneAndUpdate(
        predicate,
        { $set: { ...data } },
        {
          projection: { _id: false },
          returnOriginal: true,
          upsert: true,
        },
        (err, doc) => (err ? reject(err) : resolve(doc as T)),
      );
    });
  }

  async upsert<T>(predicate: { [p: string]: any }, data: T): Promise<T> {
    return this.findOneAndUpdate(predicate, data);
  }

  async clear(): Promise<void> {
    await this.collection.deleteMany({});
  }
}

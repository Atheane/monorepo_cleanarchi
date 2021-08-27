/* eslint-disable */
import { Collection } from 'mongoose';
import { injectable } from 'inversify';
import { WriteService } from '@oney/common-core';

@injectable()
export class MongoDbWriteService implements WriteService {
  private readonly _collection: Collection;

  constructor(collection: Collection) {
    this._collection = collection;
  }

  // Required until we setup the proper Mongoose Schemas for the new dto
  private findOneAndUpdate<T>(id: string, data: T): Promise<T> {
    return new Promise((resolve, reject) => {
      this._collection.findOneAndUpdate(
        {
          uid: id,
        },
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

  insert<T>(data: T): Promise<T> {
    return new Promise((resolve, reject) => {
      this._collection.insertOne(data, (err, result) => (err ? reject(err) : resolve(result.ops[0] as T)));
    });
  }

  updateOne<T>(id: string, data: T): Promise<T> {
    return this.findOneAndUpdate(id, data);
  }

  deleteOne(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._collection.deleteOne(
        {
          uid: id,
        },
        err => (err ? reject(err) : resolve()),
      );
    });
  }

  clear(): Promise<void> {
    return Promise.reject('method_not_implemented');
  }
}

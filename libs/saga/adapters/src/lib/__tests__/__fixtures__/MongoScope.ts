import { MongoClient } from 'mongodb';
import { assert, AsyncOrSync } from 'ts-essentials';
import * as uuid from 'uuid';
import { MongoScopeContext } from './MongoScopeContext';

export async function MongoScope<T>(fn: (dbCtx: MongoScopeContext) => AsyncOrSync<T>) {
  assert(process.env.MEMORY_MONGO_URL != null, 'The SetupMongoMemory function must be called before');

  const connection = await MongoClient.connect(process.env.MEMORY_MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const dbName: string = uuid.v4();

  const db = await connection.db(dbName);

  const context: MongoScopeContext = {
    connection: connection,
    db: db,
    uri: process.env.MEMORY_MONGO_URL,
    dbName: dbName,
  };

  return fn(context);
}

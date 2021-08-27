import { Db, MongoClient } from 'mongodb';

export interface MongoScopeContext {
  connection: MongoClient;
  db: Db;
  uri: string;
  dbName: string;
}

import { MongoMemoryServer } from 'mongodb-memory-server';
import * as Mongoose from 'mongoose';
import * as nock from 'nock';
import { beforeAll, beforeEach, afterAll } from '@jest/globals';
import { MongoClient, Db } from 'mongodb';
import { v4 } from 'uuid';

let connection: MongoClient;
let db: Db;

let mongod = undefined;

function getMongoUrl(dbName: string) {
  // Replace the db name to use a unique db name for each test
  return process.env.MONGO_URL.split('/').slice(0, -1).join('/') + `/${dbName}`;
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
beforeAll(async () => {
  try {
    mongod = new MongoMemoryServer();
    await mongod.start();
    const dbName = v4();
    const dbUrl = getMongoUrl(dbName);
    console.log('generated db name:', dbName);
    connection = await MongoClient.connect(dbUrl, {
      useNewUrlParser: true,
    });
    process.env.MONGO_URL = dbUrl;
    db = connection.db(dbName);
    process.env.MONGO_DB_NAME = dbName;
  } catch (error) {
    console.log('error:', error);
    throw error;
  }
});

beforeEach(() => {
  nock.enableNetConnect(host => host.includes('fastdl.mongodb.org'));
  nock.enableNetConnect(/127\.0\.0\.1/);
});

// Disconnect Mongoose
afterAll(async () => {
  await Mongoose.connection.close();
  await Promise.all(
    Mongoose.connections.map(c => {
      return c.close();
    }),
  );
  await Mongoose.disconnect();
  await db.dropDatabase();
  await connection.close();
  await mongod.stop();
});

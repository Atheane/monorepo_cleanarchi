import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { MongoMemoryReplSetOptsT } from 'mongodb-memory-server-core/lib/MongoMemoryReplSet';

export function SetupMongoMemory(options?: MongoMemoryReplSetOptsT): void {
  // setup part, need to create setup lifecycle
  let mongod: MongoMemoryReplSet;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  beforeAll(async () => {
    mongod = new MongoMemoryReplSet(options);

    await mongod.waitUntilRunning();

    const uri = await mongod.getUri();

    process.env.MEMORY_MONGO_URL = uri + '&retryWrites=false';
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  afterAll(async () => {
    // you may stop mongod manually
    await mongod.stop();

    // when mongod killed, it's running status should be `false`
    mongod.getInstanceOpts();

    // even you forget to stop `mongod` when you exit from script
    // special childProcess killer will shutdown it for you
  });
}

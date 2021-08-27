import { Connection, createConnection } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';

export async function MongooseScope<T>(
  clientUrl: string,
  dbName: string,
  fn: (connection: Connection) => AsyncOrSync<T>,
) {
  const connection = await createConnection(clientUrl, {
    dbName,
  });

  return fn(connection);
}

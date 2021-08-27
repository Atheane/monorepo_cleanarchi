import { defaultLogger } from '@oney/logger-adapters';
import * as mongoose from 'mongoose';
import { MongoDBConfiguration } from '../../domain/config/types/MongoDBConfiguration';

/**
 * Connect mongoose to database
 * @return {void}
 */
export async function connect(mongoConfig: MongoDBConfiguration): Promise<void> {
  await mongoose.connect(mongoConfig.uri, {
    useNewUrlParser: true,
    autoIndex: false,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  defaultLogger.info('Connected to MongoDB Database');
  defaultLogger.trace(
    'Trace mode activated for mongodb, all query and document object will be in clear on the console transport',
  );
}

/**
 * Returns the mongoose connection object
 * @return {object}
 */
export function getConnection(): mongoose.Connection {
  return mongoose.connection;
}

/**
 * Close the mongoose connection to database
 * @return {void}
 */
export async function close(): Promise<void> {
  await mongoose.disconnect();
  defaultLogger.info('Disconnected from MongoDB Database');
}

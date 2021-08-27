import { defaultLogger } from '@oney/logger-adapters';
import Worker from 'odb-lib-worker';
import { config } from '../config/config.env';
import { processMessage } from '../services/receiver';
import getNotificationsConfig from '../utils/notificationsBuilder';

/**
 * Main handler of the worker. This handler calls the handler related to the received
 * message and either complete or send the message to the deadletter depending
 * on if the handler succeeded to process the message or not
 * @param {Object} message The bus message
 * @param {String} topic The name of the topic from which the message comes from
 * @return {Promise<void>}
 */
async function workerHandler(message, topic) {
  try {
    await processMessage(message, topic);
    await message.complete();
    defaultLogger.info(`Successfully processed message ${message.messageId} from topic ${topic}`);
  } catch (err) {
    defaultLogger.error('Failed to process message, sent to deadletter', {
      topic,
      message: message.body,
      err,
    });
    await message.deadLetter();
  }
}

/**
 * Worker entry point
 * @return {Promise<void>}
 */
export default async function start() {
  const notificationsConfig = await getNotificationsConfig();
  const topics = Object.keys(notificationsConfig);
  const { subscriptionName, connectionString } = config.serviceBusConfiguration;

  const worker = new Worker(defaultLogger, topics, subscriptionName, connectionString, workerHandler);

  worker.start();
}

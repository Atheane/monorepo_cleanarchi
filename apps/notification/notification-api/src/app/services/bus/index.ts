import { ServiceBusClient } from '@azure/service-bus';

/**
 * Create bus service single instance
 */
export class BusService {
  static instance: any;
  sbClient: any;

  // eslint-disable-next-line require-jsdoc
  constructor(serviceBusConfig) {
    if (BusService.instance) {
      return BusService.instance;
    }
    BusService.instance = this;
    this.sbClient = ServiceBusClient.createFromConnectionString(serviceBusConfig.connectionString);
    return this;
  }

  /**
   * Send a message on a topic
   * @param {String} topic The destination Topic
   * @param {Object} message The message to send
   * @return {Promise<void>}
   */
  async send(topic, message) {
    const topicClient = this.sbClient.createTopicClient(topic);
    const sender = topicClient.createSender();
    await sender.send(message);
    await topicClient.close();
  }
}

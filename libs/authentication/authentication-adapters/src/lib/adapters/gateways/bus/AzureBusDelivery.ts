import { ServiceBusClient } from '@azure/service-bus';
import { BusDelivery } from '@oney/authentication-core';
import { injectable } from 'inversify';

@injectable()
export class AzureBusDelivery implements BusDelivery {
  constructor(private readonly _serviceBusClient: ServiceBusClient) {}

  async send<T>(topic: string, message: T): Promise<void> {
    const topicClient = this._serviceBusClient.createTopicClient(topic);
    const sender = topicClient.createSender();

    await sender.send({ body: message });
  }
}

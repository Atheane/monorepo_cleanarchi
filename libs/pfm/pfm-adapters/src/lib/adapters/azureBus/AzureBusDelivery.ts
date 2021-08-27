import { injectable } from 'inversify';
import { ServiceBusClient } from '@azure/service-bus';
import { BusDelivery } from '@oney/pfm-core';

@injectable()
export class AzureBusDelivery implements BusDelivery {
  constructor(private serviceBusClient: ServiceBusClient) {}

  async send<T>(topic: string, message: T): Promise<void> {
    const topicClient = this.serviceBusClient.createTopicClient(topic);
    const sender = topicClient.createSender();

    await sender.send({ body: message });
  }
}

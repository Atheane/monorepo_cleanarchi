import { ReceivedMessageInfo } from '@azure/service-bus';
import { EventMetadata } from '@oney/messages-core';
import { injectable } from 'inversify';
import { AsyncOrSync } from 'ts-essentials';

export type AzureServiceBusReceiveContext = {};

export interface AzureServiceBusHandler {
  handle: (message: ReceivedMessageInfo, ctx: AzureServiceBusReceiveContext) => AsyncOrSync<boolean>;
}

@injectable()
export abstract class ServiceBus<T, K> {
  abstract ensureSubscriptionInstance(topic: string): T;
  abstract createChannel(channel: string): K;
  abstract addSubscription(topic: string, handler: AzureServiceBusHandler): Promise<void>;
  abstract ensureSubscriptionRule(topic: string, metadata: EventMetadata): Promise<void>;
}

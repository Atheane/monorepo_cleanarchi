import { MessagingPlugin } from '@oney/ddd';
import { Logger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { AzureEventBusDispatcher } from './services/AzureEventBusDispatcher';
import { AzureEventBusReceiver } from './services/AzureEventBusReceiver';
import { AzureServiceBus } from './services/AzureServiceBus';

export function createAzureConnection(
  url: string,
  sub: string,
  channel: string,
  logger: Logger,
  finder: EventHandlerExecutionFinder,
  store: EventHandlerExecutionStore,
): MessagingPlugin {
  const serviceBus = new AzureServiceBus(url, sub, logger);

  const azureEventBusDispatcher = new AzureEventBusDispatcher(serviceBus, channel, logger);
  const azureEventBusReceiver = new AzureEventBusReceiver(finder, store, serviceBus, logger);
  return {
    dispatcher: azureEventBusDispatcher,
    receiver: azureEventBusReceiver,
  };
}

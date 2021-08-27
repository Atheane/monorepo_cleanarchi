import {
  configureInMemoryEventHandlerExecution,
  configureMongoEventHandlerExecution,
  createAzureConnection,
} from '@oney/az-servicebus-adapters';
import { buildDomainEventDependencies } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { initRxMessagingPlugin } from '@oney/rx-events-adapters';
import { connection, Connection } from 'mongoose';
import { ServiceBusConfiguration } from '../domain/config/types/ServiceBusConfiguration';
import { Kernel } from './Kernel';

let kernel: Kernel | null = null;

export async function setupKernel(
  serviceBusConfig: ServiceBusConfiguration,
  inMemory: boolean,
): Promise<Kernel> {
  kernel = new Kernel();

  if (!kernel.isBound(Connection)) {
    kernel.bind(Connection).toConstantValue(connection);
  }

  if (inMemory) {
    configureInMemoryEventHandlerExecution(kernel);
    buildDomainEventDependencies(kernel).usePlugin(initRxMessagingPlugin());
  } else {
    configureMongoEventHandlerExecution(kernel);
    buildDomainEventDependencies(kernel).usePlugin(
      createAzureConnection(
        serviceBusConfig.connectionString,
        serviceBusConfig.subscriptionName,
        serviceBusConfig.preferencesTopic,
        defaultLogger,
        kernel.get(EventHandlerExecutionFinder),
        kernel.get(EventHandlerExecutionStore),
      ),
    );
  }

  return kernel;
}

export const getKernelDependencies = () => kernel.getUseCases();

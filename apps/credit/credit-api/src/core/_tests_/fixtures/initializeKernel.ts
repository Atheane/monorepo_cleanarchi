import {
  configureInMemoryEventHandlerExecution,
  configureMongoEventHandlerExecution,
  createAzureConnection,
} from '@oney/az-servicebus-adapters';
import { SymLogger } from '@oney/logger-core';
import { IAppConfiguration } from '@oney/credit-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { Connection } from 'mongoose';
import { Kernel } from '../../di/Kernel';

export async function initializeKernel(
  inMemory: boolean,
  configuration: IAppConfiguration,
  dbConnection?: Connection,
) {
  const kernel = new Kernel(inMemory, configuration, dbConnection);

  if (inMemory) {
    configureInMemoryEventHandlerExecution(kernel);
  } else {
    configureMongoEventHandlerExecution(kernel);
  }

  kernel.useServiceBus(
    createAzureConnection(
      configuration.odbCreditBusConfiguration.connectionString,
      configuration.odbCreditBusConfiguration.subscription,
      configuration.odbCreditBusConfiguration.topic,
      kernel.get(SymLogger),
      kernel.get(EventHandlerExecutionFinder),
      kernel.get(EventHandlerExecutionStore),
    ),
  );

  await kernel.initDependencies();

  return kernel;
}

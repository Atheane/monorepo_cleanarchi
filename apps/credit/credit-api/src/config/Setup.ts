import { initMongooseConnection } from '@oney/common-adapters';
import { configureMongoEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { getAppConfiguration } from './app/AppConfigurationService';
import { DomainDependencies, Kernel } from '../core/di';

let kernel: Kernel;
export async function setupApp(): Promise<Kernel> {
  const appConfiguration = getAppConfiguration();
  const dbConnection = await initMongooseConnection(
    appConfiguration.mongoDBConfiguration.cosmosDbConnectionString,
  );
  kernel = new Kernel(false, appConfiguration, dbConnection);
  configureMongoEventHandlerExecution(kernel);
  kernel.useServiceBus(
    createAzureConnection(
      appConfiguration.odbCreditBusConfiguration.connectionString,
      appConfiguration.odbCreditBusConfiguration.subscription,
      appConfiguration.odbCreditBusConfiguration.topic,
      kernel.get(SymLogger),
      kernel.get(EventHandlerExecutionFinder),
      kernel.get(EventHandlerExecutionStore),
    ),
  );
  await kernel.initDependencies();
  return kernel;
}

export const getKernelDependencies = (): DomainDependencies => kernel?.getDependencies();

export const generateIdentifier = (): string => getKernelDependencies()?.longIdGenerator.generateUniqueID();

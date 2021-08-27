import { configureMongoEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { IAppConfiguration } from '@oney/pfm-core';
import { Connection } from 'mongoose';
import * as mongoose from 'mongoose';
import { DomainDependencies } from '../../../di/DomainDependencies';
import { PfmKernel } from '../../../di/PfmKernel';

let kernel: PfmKernel | null = null;
export async function setupKernel(
  config: IAppConfiguration,
  setupBus = false,
  dbConnection: mongoose.Connection,
): Promise<PfmKernel> {
  const { serviceBusUrl, serviceBusSubscription, pfmTopic } = config.eventsConfig;

  kernel = new PfmKernel(config, dbConnection);
  kernel.initDependencies();

  if (!kernel.isBound(Connection)) {
    kernel.bind(Connection).toConstantValue(dbConnection);
  }

  if (setupBus) {
    configureMongoEventHandlerExecution(kernel);
    kernel.useServiceBus(
      createAzureConnection(
        serviceBusUrl,
        serviceBusSubscription,
        pfmTopic,
        kernel.get(SymLogger),
        kernel.get(EventHandlerExecutionFinder),
        kernel.get(EventHandlerExecutionStore),
      ),
    );
    await kernel.initSubscribers();
  }

  return kernel;
}

export const getKernelDependencies = (): DomainDependencies => kernel?.getDependencies();

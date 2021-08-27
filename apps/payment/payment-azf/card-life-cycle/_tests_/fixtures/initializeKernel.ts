import { configureMongoEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { connection, Connection } from 'mongoose';
import { azureConfiguration, KeyVaultSecrets, keyVaultSecrets } from '../../config/config.env';
import { Kernel } from '../../core/di/Kernel';

export async function initializeKernel(inMemory: boolean, secrets?: KeyVaultSecrets) {
  const kernel = await Kernel.create(inMemory, secrets ?? keyVaultSecrets);

  if (!kernel.isBound(Connection)) {
    kernel.bind(Connection).toConstantValue(connection);
  }

  configureMongoEventHandlerExecution(kernel);

  kernel.addMessagingPlugin(
    createAzureConnection(
      keyVaultSecrets.serviceBusUrl,
      azureConfiguration.serviceBusSub,
      azureConfiguration.serviceBusTopic,
      kernel.get(SymLogger),
      kernel.get(EventHandlerExecutionFinder),
      kernel.get(EventHandlerExecutionStore),
    ),
  );

  return kernel;
}

import { Context } from '@azure/functions';
import { createAzureConnection } from '@oney/az-servicebus-adapters';
import { ConfigService } from '@oney/env';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { connection, Connection } from 'mongoose';
import { azureConfiguration, keyVaultSecrets } from '../config/config.env';
import { initMongooseConnection } from '../config/config.mongodb';
import { Kernel } from '../core/di/Kernel';

/* eslint-disable-next-line consistent-return */
export const setUp = async (context: Context): Promise<Kernel> => {
  try {
    context.log(`Node env: ${process.env.NODE_ENV}`);

    const useSystemEnv = ['production', 'development'];
    await new ConfigService({
      localUri: useSystemEnv.includes(process.env.NODE_ENV) ? null : `${process.env.NODE_ENV || 'local'}.env`,
      keyvaultUri: process.env.ODB_PAYMENT_KEY_VAULT_CONNECTION_STRING,
    }).loadEnv();

    context.log('Connection to key vault successful');

    const kernel = await Kernel.create(false, keyVaultSecrets);

    await initMongooseConnection(keyVaultSecrets.eventStoreDbUrl);

    if (!kernel.isBound(Connection)) {
      kernel.bind(Connection).toConstantValue(connection);
    }

    context.log('Connected to mongo');

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

    context.log('Kernel was created');

    return kernel;
  } catch (error) {
    throw new Error(`==== SETUP ERROR ====: ${error}`);
  }
};

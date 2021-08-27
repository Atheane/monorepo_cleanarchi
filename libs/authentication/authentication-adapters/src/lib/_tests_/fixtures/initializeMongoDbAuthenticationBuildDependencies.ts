import { configureInMemoryEventHandlerExecution, createAzureConnection } from '@oney/az-servicebus-adapters';
import { defaultLogger } from '@oney/logger-adapters';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { testConfiguration } from './config/config';
import { DomainConfiguration } from '../../adapters/models/DomainConfiguration';
import { AuthenticationBuildDependencies } from '../../di/AuthenticationBuildDependencies';

export type Params = {
  configuration?: DomainConfiguration;
  authAccessServiceKey?: string;
  mongoUrl?: string;
  dbName?: string;
};

export async function initializeMongoDbAuthenticationBuildDependencies(params?: Params) {
  const randomDbSuffix = new Date().getTime().toString(36) + Math.random().toString(36).slice(2);

  const computed: Params = {
    configuration: testConfiguration,
    authAccessServiceKey: 'authAccessServiceKey',
    mongoUrl: process.env.MONGO_URL,
    dbName: `odb_authentication_${randomDbSuffix}`,
    ...params,
  };

  const kernel = new AuthenticationBuildDependencies(computed.configuration);

  configureInMemoryEventHandlerExecution(kernel);

  await kernel
    .addMessagingPlugin(
      createAzureConnection(
        computed.configuration.eventConfiguration.serviceBusConnectionString,
        computed.configuration.eventConfiguration.subscription,
        computed.configuration.authenticationTopic,
        defaultLogger,
        kernel.get(EventHandlerExecutionFinder),
        kernel.get(EventHandlerExecutionStore),
      ),
    )
    .initStorageDependencies(computed.authAccessServiceKey, testConfiguration.frontDoorApiBaseUrl)
    .mongoDb(computed.mongoUrl, computed.dbName);

  kernel.bindDependencies(computed.authAccessServiceKey);

  return {
    kernel,
    ...computed,
  };
}

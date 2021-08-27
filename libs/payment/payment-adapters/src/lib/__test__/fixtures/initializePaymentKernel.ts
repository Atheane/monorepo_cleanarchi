import {
  configureInMemoryEventHandlerExecution,
  configureMongoEventHandlerExecution,
  createAzureConnection,
} from '@oney/az-servicebus-adapters';
import { IdentityConfiguration } from '@oney/identity-adapters';
import { ServiceName } from '@oney/identity-core';
import { defaultLogger } from '@oney/logger-adapters';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { Configuration, KvConfiguration, PaymentKernel } from '@oney/payment-adapters';
import { initRxMessagingPlugin } from '@oney/rx-events-adapters';
import { configuration, kvConfiguration } from './config/Configuration';

export type initializeConfiguration = {
  envConf?: Configuration;
  kvConf?: KvConfiguration;
  identityConfig?: IdentityConfiguration;
  useDbInMemory?: boolean;
  mongoUri?: string;
  useAzure?: boolean;
};

export async function initializePaymentKernel(initConfig?: initializeConfiguration) {
  initConfig = initConfig ?? {};

  const defaultIdentityConfig = {
    serviceName: ServiceName.payment,
    secret: 'weshpoto',
    azureTenantId: '',
    jwtOptions: {},
    applicationId: null,
    azureClientIds: {
      pp_de_reve: null,
      oney_compta: null,
    },
  };

  const computed = {
    envConf: initConfig.envConf ?? configuration,
    kvConf: initConfig.kvConf ?? kvConfiguration,
    identityConfig: {
      ...defaultIdentityConfig,
      ...initConfig.identityConfig,
    },
    useDbInMemory: initConfig.useDbInMemory ?? true,
    mongoUri: initConfig.mongoUri ?? undefined,
    useAzure: initConfig.useAzure ?? false,
  };

  const kernel = new PaymentKernel(computed.envConf, computed.kvConf).initCache();

  await kernel.useDb(computed.useDbInMemory, computed.mongoUri).initDependencies();

  if (computed.useAzure) {
    if (computed.useDbInMemory) {
      configureInMemoryEventHandlerExecution(kernel);
    } else {
      configureMongoEventHandlerExecution(kernel);
    }

    // need to add messaging dependencies before initDependencies() to be able to use event dispatcher in network provider
    kernel.addMessagingPlugin(
      createAzureConnection(
        computed.kvConf.serviceBusUrl,
        computed.envConf.serviceBusSub,
        computed.envConf.serviceBusTopic,
        defaultLogger,
        kernel.get(EventHandlerExecutionFinder),
        kernel.get(EventHandlerExecutionStore),
      ),
    );
  } else {
    configureInMemoryEventHandlerExecution(kernel);
    kernel.addMessagingPlugin(initRxMessagingPlugin());
  }

  await kernel.initServiceDependencies(computed.identityConfig);

  return kernel;
}

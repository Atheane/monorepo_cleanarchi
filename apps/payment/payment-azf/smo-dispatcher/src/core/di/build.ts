import {
  configureInMemoryEventHandlerExecution,
  configureMongoEventHandlerExecution,
  createAzureConnection,
} from '@oney/az-servicebus-adapters';
import { buildCoreModules } from '@oney/common-adapters';
import { buildDomainEventDependencies } from '@oney/ddd';
import { SymLogger } from '@oney/logger-core';
import { EventHandlerExecutionFinder, EventHandlerExecutionStore } from '@oney/messages-core';
import { OdbCallbackPayloadRepository } from '@oney/payment-adapters';
import { PaymentIdentifier, DispatchHooks, CallbackPayloadRepository } from '@oney/payment-core';
import { initRxMessagingPlugin } from '@oney/rx-events-adapters';
import { Container } from 'inversify';

interface SmoneyEkycConfiguration {
  mongoCollection: string;
  inMemoryMode: boolean;
  forceAzureServiceBus: boolean;
  serviceBusSub: string;
  serviceBusTopic: string;
}

interface SmoneyEkycKeyVaultConfiguration {
  mongoUrl: string;
  serviceBusUrl: string;
}

export async function buildAzfSmoneyEkyc(
  container: Container,
  config: SmoneyEkycConfiguration,
  keyvaultConfiguration: SmoneyEkycKeyVaultConfiguration,
): Promise<void> {
  await buildCoreModules(container, config.inMemoryMode, {
    mongodb: {
      url: keyvaultConfiguration.mongoUrl,
      collection: config.mongoCollection,
    },
  });
  container
    .bind<CallbackPayloadRepository>(PaymentIdentifier.callbackPayloadRepository)
    .to(OdbCallbackPayloadRepository);
  container.bind<DispatchHooks>(DispatchHooks).to(DispatchHooks);

  if (config.inMemoryMode && !config.forceAzureServiceBus) {
    configureInMemoryEventHandlerExecution(container);
    buildDomainEventDependencies(container).usePlugin(initRxMessagingPlugin());
  } else {
    configureMongoEventHandlerExecution(container);
    buildDomainEventDependencies(container).usePlugin(
      createAzureConnection(
        keyvaultConfiguration.serviceBusUrl,
        config.serviceBusSub,
        config.serviceBusTopic,
        container.get(SymLogger),
        this.get(EventHandlerExecutionFinder),
        this.get(EventHandlerExecutionStore),
      ),
    );
  }
}

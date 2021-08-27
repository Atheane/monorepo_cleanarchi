import { ServiceBusClient } from '@azure/service-bus';
import {
  CommandDispatcher,
  CommandHandlerActivator,
  CommandHandlerRegistry,
  CommandMessageBodyMapper,
  CommandMessageBodySerializer,
  CommandReceiver,
  SymQueueProviderFromCommandCtor,
  SymQueueProviderFromCommandInstance,
} from '@oney/messages-core';
import { Container } from 'inversify';
import { AzureServiceBusCommandDispatcher } from './AzureServiceBusCommandDispatcher';
import { AzureServiceBusCommandReceiver } from './AzureServiceBusCommandReceiver';
import { CommandManager } from '../CommandManager';
import { DefaultCommandHandlerActivator } from '../DefaultCommandHandlerActivator';
import { DefaultCommandHandlerRegistry } from '../DefaultCommandHandlerRegistry';
import { DefaultCommandMessageBodyMapper } from '../DefaultCommandMessageBodyMapper';
import { DefaultCommandMessageBodySerializer } from '../DefaultCommandMessageBodySerializer';
import { DefaultQueueProviderFromCommand } from '../DefaultQueueProviderFromCommand';

export interface AzureCommandServiceBusConfiguration {
  connectionString: string;
}

export type CommandManagerRegister = Pick<CommandManager, 'register'>;

// todo make the configuration more "swag"
export async function configureAzureCommandServiceBus(
  container: Container,
  config: AzureCommandServiceBusConfiguration,
  registration: (em: CommandManagerRegister) => void,
): Promise<void> {
  const registry = new DefaultCommandHandlerRegistry();

  container.bind(DefaultCommandHandlerRegistry).toConstantValue(registry);
  container.bind(CommandHandlerRegistry).toConstantValue(registry);

  const queueProvider = new DefaultQueueProviderFromCommand(registry);

  container.bind(DefaultQueueProviderFromCommand).toConstantValue(queueProvider);
  container.bind(SymQueueProviderFromCommandInstance).toConstantValue(queueProvider);
  container.bind(SymQueueProviderFromCommandCtor).toConstantValue(queueProvider);

  const mapper = new DefaultCommandMessageBodyMapper();

  container.bind(DefaultCommandMessageBodyMapper).toConstantValue(mapper);
  container.bind(CommandMessageBodyMapper).toConstantValue(mapper);

  const serializer = new DefaultCommandMessageBodySerializer();

  container.bind(DefaultCommandMessageBodySerializer).toConstantValue(serializer);
  container.bind(CommandMessageBodySerializer).toConstantValue(serializer);

  const activator = new DefaultCommandHandlerActivator(container);

  container.bind(DefaultCommandHandlerActivator).toConstantValue(activator);
  container.bind(CommandHandlerActivator).toConstantValue(activator);

  const serviceBusClient = ServiceBusClient.createFromConnectionString(config.connectionString);
  const dispatcher = new AzureServiceBusCommandDispatcher(
    serviceBusClient,
    queueProvider,
    mapper,
    serializer,
  );
  const receiver = new AzureServiceBusCommandReceiver(
    serviceBusClient,
    queueProvider,
    mapper,
    serializer,
    activator,
  );

  container.bind(AzureServiceBusCommandDispatcher).toConstantValue(dispatcher);
  container.bind(CommandDispatcher).toConstantValue(dispatcher);

  container.bind(AzureServiceBusCommandReceiver).toConstantValue(receiver);
  container.bind(CommandReceiver).toConstantValue(receiver);

  const manager = new CommandManager(receiver, registry, queueProvider);

  container.bind(CommandManager).toConstantValue(manager);

  registration(manager);

  await manager.start();
}

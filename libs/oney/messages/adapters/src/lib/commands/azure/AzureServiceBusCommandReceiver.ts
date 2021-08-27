import { QueueClient, ReceiveMode, Receiver, ServiceBusClient, ServiceBusMessage } from '@azure/service-bus';
import { Disposable } from '@oney/core';
import { defaultLogger } from '@oney/logger-adapters';
import {
  Command,
  CommandCtor,
  CommandHandlerActivator,
  CommandHandlerCtor,
  CommandMessageBody,
  CommandMessageBodyMapper,
  CommandMessageBodySerializer,
  CommandMetadata,
  CommandReceiver,
  CommandReceiverOptions,
  QueueProviderFromCommandCtor,
} from '@oney/messages-core';

export class AzureServiceBusCommandReceiver extends CommandReceiver {
  private _serviceBus: ServiceBusClient;
  private _queueProvider: QueueProviderFromCommandCtor;
  private _mapper: CommandMessageBodyMapper;
  private _serializer: CommandMessageBodySerializer;
  private _activator: CommandHandlerActivator;

  constructor(
    serviceBus: ServiceBusClient,
    queueProvider: QueueProviderFromCommandCtor,
    mapper: CommandMessageBodyMapper,
    serializer: CommandMessageBodySerializer,
    activator: CommandHandlerActivator,
  ) {
    super();
    this._serviceBus = serviceBus;
    this._queueProvider = queueProvider;
    this._mapper = mapper;
    this._serializer = serializer;
    this._activator = activator;
  }

  public async subscribe<TCommand extends Command>(
    commandCtor: CommandCtor<TCommand>,
    handlerCtor: CommandHandlerCtor<TCommand>,
    options?: CommandReceiverOptions,
  ): Promise<Disposable> {
    try {
      defaultLogger.info(`Command handler ${handlerCtor.name} registered, for command ${commandCtor.name}`, {
        commandCtor,
        handlerCtor,
        options,
      });

      // todo check if we already have a handler for this command

      const mapper = options?.customMapper ?? this._mapper;
      const serializer = options?.customSerializer ?? this._serializer;

      const metadata = CommandMetadata.getOrThrowFromCtor(commandCtor);

      const queue = await this._queueProvider.getQueue(commandCtor);

      const queueClient = this._serviceBus.createQueueClient(queue);

      // todo we want peekLock ?
      const receiver = queueClient.createReceiver(ReceiveMode.peekLock);

      // todo maybe use only one receiver by queue for all commands, and select handler
      receiver.registerMessageHandler(
        async (message: ServiceBusMessage) => {
          try {
            if (!this.match(metadata, message)) {
              defaultLogger.debug(`Command ${message.label} doesn't match with handler ${handlerCtor.name}`, {
                message: {
                  label: message.label,
                  userProperties: message.userProperties,
                },
                metadata,
              });
              return;
            }

            const messageBody = serializer.deserialize<TCommand>(message.body);

            defaultLogger.info(`Handle message: ${message.label} from queue ${queue}`, {
              message: this.extractBodyWithoutPayload(messageBody),
              queue: queue,
            });

            const command = mapper.toCommand<TCommand>(messageBody);

            const handler = this._activator.activate(handlerCtor);

            await handler.handle(command, {});

            defaultLogger.info(`Complete message: ${message.label} from queue ${queue}`, {
              message: this.extractBodyWithoutPayload(messageBody),
              queue: queue,
            });

            await message.complete();
          } catch (error) {
            defaultLogger.error(`Error occurred while handle command: ${message.label}`, { error });
            throw error;
          }
        },
        error => {
          defaultLogger.error(`Error occurred while receive command: ${metadata.fullyQualifiedName}`, {
            error,
          });
        },
        {},
      );

      return new CommandReceiverSubscription(handlerCtor.name, queueClient, receiver);
    } catch (error) {
      defaultLogger.error(`Error occurred while register command handler: ${handlerCtor.name}`, {
        commandCtor,
        handlerCtor,
        options,
        error,
      });
    }
  }

  private extractBodyWithoutPayload(messageBody: CommandMessageBody): Omit<CommandMessageBody, 'payload'> {
    const result = {
      ...messageBody,
    };

    delete result.payload;

    return result;
  }

  private match(metadata: CommandMetadata, message: ServiceBusMessage): boolean {
    // complex condition to keep the support of legacy events
    return (
      message.userProperties.namespace === metadata.namespace &&
      message.userProperties.name === metadata.name &&
      message.userProperties.version === metadata.version
    );
  }
}

export class CommandReceiverSubscription implements Disposable {
  private _handlerName: string;
  private _queueClient: QueueClient;
  private _receiver: Receiver;

  constructor(handlerName: string, queueClient: QueueClient, receiver: Receiver) {
    this._handlerName = handlerName;
    this._queueClient = queueClient;
    this._receiver = receiver;
  }

  public dispose(): void {
    this._receiver.close().then(() => {
      defaultLogger.info(`Receiver close for handler: ${this._handlerName}`);
    });

    this._queueClient.close().then(() => {
      defaultLogger.info(`QueueClient close for handler: ${this._handlerName}`);
    });
  }
}

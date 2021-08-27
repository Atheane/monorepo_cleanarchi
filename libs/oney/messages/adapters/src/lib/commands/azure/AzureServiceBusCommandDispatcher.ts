import { ServiceBusClient } from '@azure/service-bus';
import { defaultLogger } from '@oney/logger-adapters';
import {
  Command,
  CommandDispatcher,
  CommandDispatcherOptions,
  CommandMessageBodyMapper,
  CommandMessageBodySerializer,
  CommandMetadata,
  QueueProviderFromCommandInstance,
} from '@oney/messages-core';

export class AzureServiceBusCommandDispatcher extends CommandDispatcher {
  private _serviceBus: ServiceBusClient;
  private _queueProvider: QueueProviderFromCommandInstance;
  private _mapper: CommandMessageBodyMapper;
  private _serializer: CommandMessageBodySerializer;

  constructor(
    serviceBus: ServiceBusClient,
    queueProvider: QueueProviderFromCommandInstance,
    mapper: CommandMessageBodyMapper,
    serializer: CommandMessageBodySerializer,
  ) {
    super();
    this._serviceBus = serviceBus;
    this._queueProvider = queueProvider;
    this._mapper = mapper;
    this._serializer = serializer;
  }

  public async doDispatch(commands: Command[], options?: CommandDispatcherOptions): Promise<void> {
    // todo aggregate exceptions, to avoid foreach interruption
    for (const command of commands) {
      await this.publish(command, options);
    }
  }

  private async publish(command: Command, options?: CommandDispatcherOptions) {
    const mapper = options?.customMapper ?? this._mapper;
    const serializer = options?.customSerializer ?? this._serializer;

    const metadata = CommandMetadata.getOrThrowFromInstance(command);

    const queue = await this._queueProvider.getQueue(command);
    const queueClient = this._serviceBus.createQueueClient(queue);
    const sender = queueClient.createSender();

    const messageBody = mapper.toCommandMessageBody(command);
    const serializedMessageBody = serializer.serialize(messageBody);

    try {
      defaultLogger.info(`Send azure command ${metadata.fullyQualifiedName} in queue: ${queue}`);

      await sender.send({
        body: serializedMessageBody,
        messageId: command.id,
        label: metadata.fullyQualifiedName,
        userProperties: {
          namespace: metadata.namespace,
          name: metadata.name,
          version: metadata.version,
        },
        scheduledEnqueueTimeUtc: this.getScheduledEnqueueTimeUtc(metadata, options),
      });
    } catch (e) {
      defaultLogger.error(`An error occurred while sending command: ${metadata.fullyQualifiedName}`, {
        error: e,
        command: command,
        metadata: metadata,
      });
      throw e;
    } finally {
      await sender.close();
      await queueClient.close();
    }
  }

  private getScheduledEnqueueTimeUtc(
    metadata: CommandMetadata,
    options?: CommandDispatcherOptions,
  ): Date | undefined {
    if (options?.scheduledEnqueueTimeUtc) {
      defaultLogger.info(
        `${metadata.fullyQualifiedName} scheduled at ${options?.scheduledEnqueueTimeUtc.toISOString()}`,
      );
    }

    return options?.scheduledEnqueueTimeUtc;
  }
}

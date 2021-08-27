import { Sender, SubscriptionClient, TopicClient } from '@azure/service-bus';
import { AggregateRoot } from '@oney/ddd';
import { DefaultEventMessageBodyMapper, DefaultEventMessageBodySerializer } from '@oney/messages-adapters';
import { EventDispatcher, EventMetadata, Event, EventDispatcherOptions } from '@oney/messages-core';
import { Logger, SymLogger } from '@oney/logger-core';
import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';
import { v4 as uuidv4 } from 'uuid';
import { ServiceBus } from './ServiceBus';
import { AzMessage } from './types/AzMessage';

/* istanbul ignore next */
@injectable()
export class AzureEventBusDispatcher extends EventDispatcher {
  private readonly _sender: Sender;
  private _defaultMapper: DefaultEventMessageBodyMapper;
  private _defaultSerializer: DefaultEventMessageBodySerializer;

  constructor(
    private readonly _eventBus: ServiceBus<SubscriptionClient, TopicClient>,
    private readonly _channel: string,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    super();

    const topicClient = this._eventBus.createChannel(this._channel);
    this._sender = topicClient.createSender();
    this._defaultMapper = new DefaultEventMessageBodyMapper();
    this._defaultSerializer = new DefaultEventMessageBodySerializer();
  }

  async doDispatch(events: Event[], options?: EventDispatcherOptions): Promise<void> {
    for (const event of events) {
      const partitionKeyId = uuidv4();

      // todo fix me, it's a temporary solution before fix the typing some aggregate root was assignable to Message interface
      if (event instanceof AggregateRoot) {
        throw new Error('Event should not be an AggregateRoot');
      }

      await this.publish(event, partitionKeyId, options);
    }
  }

  private async publish(
    domainEvent: Event,
    partitionKeyId: string,
    options?: EventDispatcherOptions,
  ): Promise<void> {
    const mapper = options?.customMapper ?? this._defaultMapper;
    const serializer = options?.customSerializer ?? this._defaultSerializer;

    try {
      const metadata = EventMetadata.getOrThrowFromInstance(domainEvent);

      this._logger.info(
        `Prepare to send azure event ${metadata.fullyQualifiedName} in topic: ${this._channel}`,
        {
          metadata,
        },
      );

      const eventMessageBody = mapper.toEventMessageBody(domainEvent);
      const serializedBody = serializer.serialize(eventMessageBody);

      assert(domainEvent.id != null, `${domainEvent.constructor.name} event should have a DEFINED id`);

      const message: AzMessage = {
        body: serializedBody,
        // We put the event to differentiate from other domainEvent as the id can be the same.
        messageId: domainEvent.id,
        partitionKey: partitionKeyId,
        label: metadata.name,
        userProperties: {
          namespace: metadata.namespace,
          name: metadata.name,
          version: metadata.version,
        },
      };

      this._logger.info(`Send azure event ${metadata.fullyQualifiedName} in topic: ${this._channel}`, {
        ...this.extractMessageWithoutBody(message),
      });

      return await this._sender.send(message);
    } catch (e) {
      this._logger.error(`An error occurred while message sending: ${e.message}`, {
        error: e,
      });
      throw e;
    }
  }

  private extractMessageWithoutBody(message: AzMessage) {
    const result = {
      ...message,
    };

    delete result.body;

    return result;
  }
}

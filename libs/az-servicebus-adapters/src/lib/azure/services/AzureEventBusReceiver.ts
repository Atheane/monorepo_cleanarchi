import { ReceivedMessageInfo, SubscriptionClient, TopicClient } from '@azure/service-bus';
import { defaultAlert } from '@oney/logger-adapters';
import { DefaultEventMessageBodyMapper, DefaultEventMessageBodySerializer } from '@oney/messages-adapters';
import {
  EventReceiver,
  SubscriptionInfo,
  Event,
  EventHandler,
  EventMetadata,
  EventHandlerExecutionFinder,
  EventHandlerExecutionStore,
  EventHandlerSubscription,
} from '@oney/messages-core';
import { Logger, SymLogger } from '@oney/logger-core';
import { inject, injectable } from 'inversify';
import { assert } from 'ts-essentials';
import { IdempotentEventHandlerExecutionStrategy } from './execution/IdempotentEventHandlerExecutionStrategy';
import { EventHandlerExecution } from './execution/EventHandlerExecution';
import { EventHandlerSubscriptionMapper } from './execution/mappers/EventHandlerSubscriptionMapper';
import { ReceivedMessageInfoMapper } from './execution/mappers/ReceivedMessageInfoMapper';
import { AzureServiceBusHandler, AzureServiceBusReceiveContext, ServiceBus } from './ServiceBus';

/* istanbul ignore next */
@injectable()
export class AzureEventBusReceiver extends EventReceiver implements AzureServiceBusHandler {
  private _defaultMapper: DefaultEventMessageBodyMapper;
  private _defaultSerializer: DefaultEventMessageBodySerializer;
  private _activeSubscriptions: EventHandlerSubscription[];
  private _subscriptionClientByTopic: Map<string, SubscriptionClient>;

  constructor(
    private readonly _finder: EventHandlerExecutionFinder,
    private readonly _store: EventHandlerExecutionStore,
    private readonly _eventBus: ServiceBus<SubscriptionClient, TopicClient>,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    super();
    this._defaultMapper = new DefaultEventMessageBodyMapper();
    this._defaultSerializer = new DefaultEventMessageBodySerializer();

    this._activeSubscriptions = [];
    this._subscriptionClientByTopic = new Map<string, SubscriptionClient>();
  }

  private async ensureRegistration(topic: string) {
    let subscriptionInstance = this._subscriptionClientByTopic.get(topic);
    if (!subscriptionInstance) {
      this._logger.info(`Add subscription for topic ${topic}`);
      subscriptionInstance = this._eventBus.ensureSubscriptionInstance(topic);

      await this._eventBus.addSubscription(topic, this);

      this._subscriptionClientByTopic.set(topic, subscriptionInstance);
    }
  }

  async subscribe<T extends Event>(info: SubscriptionInfo, eventHandler: EventHandler<T>) {
    this._logger.info(`Register EventHandler ${eventHandler.constructor.name}, for event ${info.event.name}`);

    const metadata = EventMetadata.getOrThrowFromCtor(info.event);

    await this.ensureRegistration(info.topic);
    await this._eventBus.ensureSubscriptionRule(info.topic, metadata);

    const mapper = info.customMapper ?? this._defaultMapper;
    const serializer = info.customSerializer ?? this._defaultSerializer;

    const handlerUniqueIdentifier = info.handlerUniqueIdentifier ?? eventHandler.constructor.name;

    const duplicatedIdentifier = this._activeSubscriptions.some(
      x => x.handlerUniqueIdentifier === handlerUniqueIdentifier,
    );
    if (duplicatedIdentifier) {
      const message = `Duplicated handler registered with same identifier ${handlerUniqueIdentifier}`;
      this._logger.error(message);
      throw new Error(message);
    }

    this._activeSubscriptions.push({
      topic: info.topic,
      subscription: '', // todo
      eventMetadata: metadata,
      handler: eventHandler,
      handlerUniqueIdentifier: handlerUniqueIdentifier,
      mapper: mapper,
      serializer: serializer,
      executionStrategy: new IdempotentEventHandlerExecutionStrategy(this._finder),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handle(message: ReceivedMessageInfo, ctx: AzureServiceBusReceiveContext): Promise<boolean> {
    assert(message.messageId != null, 'message.messageId SHOULD BE DEFINED');

    const subscriptions = this._activeSubscriptions;

    this._logger.debug(`Currently active subscriptions: ${subscriptions.length}`);

    let shouldCompleteMessage = true;
    for (const subscription of subscriptions) {
      try {
        const execution = new EventHandlerExecution(subscription, this._store);
        const result = await execution.execute(message);

        if (!result.completed) {
          shouldCompleteMessage = false;
        }
      } catch (e) {
        defaultAlert.fatal(`${AzureEventBusReceiver.name}: An error occurred in a safe execution context`, {
          message: ReceivedMessageInfoMapper.toLog(message),
          subscription: EventHandlerSubscriptionMapper.toLog(subscription),
        });

        shouldCompleteMessage = false;
      }
    }

    return shouldCompleteMessage;
  }
}

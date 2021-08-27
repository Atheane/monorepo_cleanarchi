import { ReceivedMessageInfo } from '@azure/service-bus';
import { defaultLogger } from '@oney/logger-adapters';
import {
  DeserializedServiceBusMessage,
  EventHandlerExecutionContext,
  EventHandlerExecutionResult,
  EventHandlerExecutionStatus,
  EventHandlerExecutionStore,
  EventHandlerSubscription,
  StaticEventRegistry,
} from '@oney/messages-core';
import { v4 } from 'uuid';
import { AzEventType } from '../types/AzEventType';
import { EventHandlerSubscriptionMapper } from './mappers/EventHandlerSubscriptionMapper';
import { ReceivedMessageInfoMapper } from './mappers/ReceivedMessageInfoMapper';

export class EventHandlerExecution {
  private _subscription: EventHandlerSubscription;
  private _context: EventHandlerExecutionContext;
  private _store: EventHandlerExecutionStore;

  constructor(subscription: EventHandlerSubscription, store: EventHandlerExecutionStore) {
    this._subscription = subscription;
    this._store = store;
  }

  public async execute(message: ReceivedMessageInfo) {
    this.reentrantCheck();

    try {
      this.initializeExecutionContext(message);

      defaultLogger.debug('@oney/messages.EventHandlerExecution.execute.begin', this.currentLogMetadata);

      const match = this.match(message);
      if (!match) {
        this._context.execution.status = EventHandlerExecutionStatus.NOT_MATCHED;
        return new EventHandlerExecutionResult(this._context);
      }

      // todo we apply this strategy before deserialization or after ?
      const shouldBeExecute = await this.shouldBeExecute(message);
      if (!shouldBeExecute) {
        this._context.execution.status = EventHandlerExecutionStatus.COMPLETED;
        return new EventHandlerExecutionResult(this._context);
      }

      this._context.execution.status = EventHandlerExecutionStatus.WAITING_HANDLE;

      await this.persistExecutionBeginning();

      const deserializeMessage = this.applyDeserializer(message);
      const event = this.applyToEvent(deserializeMessage);

      const completed = await this.applyHandle(event);

      this._context.execution.status = completed
        ? EventHandlerExecutionStatus.COMPLETED
        : EventHandlerExecutionStatus.FAILED;
    } catch (error) {
      this._context.execution.executeError = error;
      this._context.execution.status = EventHandlerExecutionStatus.FAILED;

      defaultLogger.fatal(
        `EventHandlerExecution: Error occurred while executing: ${message.label} by handler ${this.currentLogMetadata.subscription.handler}`,
        this.currentLogMetadata,
      );
    }

    this._context.execution.endsAt = new Date();
    await this.persistExecutionEnding();

    return new EventHandlerExecutionResult(this._context);
  }

  get currentLogMetadata() {
    const context = this._context;
    return {
      execution: {
        ...context.execution,
      },
      message: ReceivedMessageInfoMapper.toLog(context.message),
      subscription: EventHandlerSubscriptionMapper.toLog(context.subscription),
    };
  }

  private _alreadyExecuted = false;
  private reentrantCheck() {
    // integrity check to avoid multiple execution, or reentrant code
    if (this._alreadyExecuted) {
      throw new Error(`${EventHandlerExecution.name} multiple execute call error`);
    }

    this._alreadyExecuted = true;
  }

  private initializeExecutionContext(message: ReceivedMessageInfo) {
    this._context = {
      executionId: v4(),
      message: message,
      subscription: this._subscription,
      execution: {
        beginsAt: new Date(),
        endsAt: undefined,
        status: EventHandlerExecutionStatus.WAITING_MATCH,
      },
    };
  }

  private match(message: ReceivedMessageInfo) {
    const strategy = this._subscription.executionStrategy;
    const match = strategy.match(message, this._subscription);
    if (!match) {
      defaultLogger.debug(
        `Message ${message.label} doesn't match with handler ${this.currentLogMetadata.subscription.handler}`,
        this.currentLogMetadata,
      );
      return false;
    }
    return true;
  }

  private applyDeserializer(message: ReceivedMessageInfo): DeserializedServiceBusMessage {
    const serializer = this._subscription.serializer;

    defaultLogger.debug(
      `Deserialize message ${message.label} from topic ${this.currentLogMetadata.subscription.topic}`,
      this.currentLogMetadata,
    );

    const messageBody = serializer.deserialize(message.body);

    // todo capture context, foreach on each property and construct an object with value the typeof primitive property

    defaultLogger.debug(
      `Deserialize message ${message.label} from topic ${this.currentLogMetadata.subscription.topic} completed`,
      this.currentLogMetadata,
    );

    return {
      ...message,
      body: messageBody,
    };
  }

  private applyToEvent(message: DeserializedServiceBusMessage) {
    const mapper = this._subscription.mapper;

    defaultLogger.debug(`Map message ${message.label}`, this.currentLogMetadata);

    // todo fix this ugly thing, exists for legacy reason
    const azEvent = mapper.toEvent<any>(message.body);
    const event = this.tryToGetRealInstance(azEvent);

    defaultLogger.debug(`Map message ${message.label} completed`, this.currentLogMetadata);

    return event;
  }

  private tryToGetRealInstance(eventMessage: AzEventType) {
    const metadata = eventMessage.metadata;
    const entry = StaticEventRegistry.get(metadata.namespace, metadata.eventName, metadata.version);

    let event: any = {};
    if (entry) {
      event = new entry.target();
    } else {
      defaultLogger.warn(`Event constructor not found for: ${metadata.eventName}`, { metadata });
    }

    Object.assign(event, eventMessage);

    return event;
  }

  private async shouldBeExecute(message: ReceivedMessageInfo) {
    const strategy = this._subscription.executionStrategy;
    const shouldBeExecute = await strategy.shouldExecute(message, this._subscription);
    if (!shouldBeExecute) {
      defaultLogger.debug(
        `Message ${message.label} should not be execute with handler ${this.currentLogMetadata.subscription.handler}`,
        this.currentLogMetadata,
      );
      return false;
    }
    return true;
  }

  private async persistExecutionBeginning() {
    await this._store.ensure(this._context);
    await this._store.updateHistory(this._context);
  }

  private async applyHandle(event: any) {
    const handler = this._subscription.handler;

    defaultLogger.debug(
      `Handle event ${event.constructor.name} by handler ${this.currentLogMetadata.subscription.handler}`,
      this.currentLogMetadata,
    );

    try {
      // todo include this execute logic in the strategy
      await handler.handle(event, {});

      defaultLogger.debug(
        `Handle event ${event.constructor.name} by handler ${this.currentLogMetadata.subscription.handler} completed`,
        this.currentLogMetadata,
      );

      return true;
    } catch (error) {
      this._context.execution.handleError = error;
      defaultLogger.debug(
        `Handle event ${event.constructor.name} by handler ${this.currentLogMetadata.subscription.handler} failed`,
        this.currentLogMetadata,
      );
      return false;
    }
  }

  private async persistExecutionEnding() {
    // todo make integrity check ?
    await this._store.updateHistory(this._context);
  }
}

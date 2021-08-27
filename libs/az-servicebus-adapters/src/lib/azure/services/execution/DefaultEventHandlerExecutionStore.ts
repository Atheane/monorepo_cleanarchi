import { ReceivedMessageInfo } from '@azure/service-bus';
import {
  EventHandlerExecutionContext,
  EventHandlerExecutionDataModel,
  EventHandlerExecutionRepository,
  EventHandlerExecutionStatus,
  EventHandlerExecutionStore,
} from '@oney/messages-core';
import { assert } from 'ts-essentials';

export class DefaultEventHandlerExecutionStore extends EventHandlerExecutionStore {
  private _repository: EventHandlerExecutionRepository;

  constructor(repository: EventHandlerExecutionRepository) {
    super();
    this._repository = repository;
  }

  public async ensure(context: EventHandlerExecutionContext) {
    const entry = await this._repository.findOne(
      context.message.messageId.toString(),
      context.subscription.handlerUniqueIdentifier,
    );

    if (!entry) {
      const datamodel: EventHandlerExecutionDataModel = {
        messageId: context.message.messageId.toString(),
        handlerUniqueIdentifier: context.subscription.handlerUniqueIdentifier,
        createdAt: new Date(),
        updatedAt: new Date(),
        history: [],
      };

      await this._repository.persist(datamodel);
    }
  }

  public async updateHistory(context: EventHandlerExecutionContext) {
    const entry = await this._repository.findOne(
      context.message.messageId.toString(),
      context.subscription.handlerUniqueIdentifier,
    );

    assert(entry != null);

    const historyEntry = entry.history.find(x => x.executionId === context.executionId);

    // todo make a mapper
    const mappedContext = {
      execution: {
        ...context.execution,
      },
      message: {
        ...this.getMessageSafeProps(context.message),
      },
      subscription: {
        topic: context.subscription.topic,
        subscription: context.subscription.subscription,
        eventMetadata: context.subscription.eventMetadata,
        handler: context.subscription.handler.constructor.name,
        handlerUniqueIdentifier: context.subscription.handlerUniqueIdentifier,
        mapper: context.subscription.mapper.constructor.name,
        serializer: context.subscription.serializer.constructor.name,
        executionStrategy: context.subscription.executionStrategy.constructor.name,
      },
    };

    if (!historyEntry) {
      entry.history.push({
        executionId: context.executionId,
        execution: mappedContext.execution,
        message: mappedContext.message,
        subscription: mappedContext.subscription,
      });
    } else {
      historyEntry.execution = mappedContext.execution;
      historyEntry.message = mappedContext.message;
      historyEntry.subscription = mappedContext.subscription;
    }

    const date = new Date();
    entry.updatedAt = date;
    if (context.execution.status === EventHandlerExecutionStatus.COMPLETED) {
      entry.completedAt = date;
    }

    await this._repository.persist(entry);
  }

  private getMessageSafeProps(message: ReceivedMessageInfo) {
    return {
      messageId: message.messageId,
      label: message.label,
      partitionKey: message.partitionKey,
      userProperties: message.userProperties,
    };
  }
}

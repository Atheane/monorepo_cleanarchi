import {
  EventHandlerExecutionDataModel,
  EventHandlerExecutionFinder,
  EventHandlerExecutionRepository,
} from '@oney/messages-core';

export class DefaultEventHandlerExecutionFinder extends EventHandlerExecutionFinder {
  private _repository: EventHandlerExecutionRepository;

  constructor(repository: EventHandlerExecutionRepository) {
    super();
    this._repository = repository;
  }

  public async find(
    messageId: string,
    handlerUniqueIdentifier: string,
  ): Promise<EventHandlerExecutionDataModel | undefined> {
    return await this._repository.findOne(messageId, handlerUniqueIdentifier);
  }
}

import { CommandDispatcher, EventDispatcher, EventReceiveContext } from '@oney/messages-core';
import { ActiveSaga } from './models/ActiveSaga';
import { SagaState } from './models/SagaState';

export class SagaExecutionContext<TSagaState extends SagaState> implements EventReceiveContext {
  private _activeSaga: ActiveSaga<TSagaState>;

  constructor(
    activeSaga: ActiveSaga<TSagaState>,
    eventDispatcher: EventDispatcher,
    commandDispatcher: CommandDispatcher,
  ) {
    this._activeSaga = activeSaga;
    this.eventDispatcher = eventDispatcher;
    this.commandDispatcher = commandDispatcher;
  }

  public readonly eventDispatcher: EventDispatcher;
  public readonly commandDispatcher: CommandDispatcher;
}

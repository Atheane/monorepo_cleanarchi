import { EventCtor, EventDispatcher, Event, CommandDispatcher } from '@oney/messages-core';
import {
  ActiveSaga,
  ActiveSagaHistoryEntry,
  SagaActiveStore,
  SagaEventHandle,
  SagaExecutionContext,
  SagaExecutionManager,
  SagaState,
} from '@oney/saga-core';
import * as _ from 'lodash';

export class InMemorySagaExecutionManager extends SagaExecutionManager {
  private _activeStore: SagaActiveStore;
  private _eventDispatcher: EventDispatcher;
  private _commandDispatcher: CommandDispatcher;

  constructor(
    activeStore: SagaActiveStore,
    eventDispatcher: EventDispatcher,
    commandDispatcher: CommandDispatcher,
  ) {
    super();
    this._activeStore = activeStore;
    this._eventDispatcher = eventDispatcher;
    this._commandDispatcher = commandDispatcher;
  }

  public async execute(event: Event, activeSagas: ActiveSaga<SagaState>[]): Promise<void> {
    if (!activeSagas) return;

    for (const activeSaga of activeSagas) {
      const definition = activeSaga.definition.findDefinitionByEvent(event.constructor as EventCtor<Event>);

      const key = definition.sagaHandlePropertyKey;

      // todo i don't like the bind, try to find a solution to avoid this
      const handle: SagaEventHandle = activeSaga.instance[key].bind(activeSaga.instance);

      const beforeState = _.cloneDeep(activeSaga.instance.state);
      const historyEntry = new ActiveSagaHistoryEntry(beforeState, event);
      historyEntry.executedAt = new Date(Date.now());

      // todo change InMemorySagaEventDispatcher
      const context = new SagaExecutionContext(activeSaga, this._eventDispatcher, this._commandDispatcher);

      // todo make an event clone
      // todo make the context
      // todo make a beautiful try / catch
      await handle(event, context);

      const afterState = _.cloneDeep(activeSaga.instance.state);
      historyEntry.afterState = afterState;

      activeSaga.history.push(historyEntry);

      // todo check the state with the correlation, to be sure to detect duplication
      // todo should be factorized
      const fromEventValue = definition.fromEventSelect(event);
      const fromStateValue = definition.toSagaSelect(activeSaga.instance.state);

      // todo add a better error treatment
      if (fromEventValue != fromStateValue) {
        console.log('State synchronization failed', fromEventValue, fromStateValue);
      }

      await this._activeStore.persist(activeSaga);
    }
  }
}

import { Uuid } from '@oney/core';
import { Event } from '@oney/messages-core';
import { ActiveSagaHistoryEntry } from './ActiveSagaHistoryEntry';
import { SagaDefinition } from './SagaDefinition';
import { SagaState } from './SagaState';
import { SagaWorkflow } from './SagaWorkflow';

export type ActiveSagaCtorParams<TSagaState extends SagaState> = Pick<
  ActiveSaga<TSagaState>,
  keyof ActiveSaga<TSagaState>
>;

export class ActiveSaga<TSagaState extends SagaState> {
  constructor(data: ActiveSagaCtorParams<TSagaState>) {
    Object.assign(this, data);
  }

  /// <summary>
  /// The id of the active saga.
  /// </summary>
  activeSagaId: Uuid;

  /// <summary>
  /// Definition for this active saga.
  /// </summary>
  definition: SagaDefinition;

  /// <summary>
  /// The actual saga instance.
  /// </summary>
  instance: SagaWorkflow<TSagaState>;

  history: ActiveSagaHistoryEntry<TSagaState, Event>[];

  /// <summary>
  /// UTC date of when the active saga instance was created.
  /// </summary>
  createdAt: Date;

  /// <summary>
  /// UTC date of when the active saga instance was last modified.
  /// </summary>
  updatedAt: Date;
}

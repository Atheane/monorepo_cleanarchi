import { Event } from '@oney/messages-core';
import {
  ActiveSaga,
  ActiveSagaDataModel,
  ActiveSagaHistoryEntry,
  SagaActivator,
  SagaRegistry,
  SagaState,
} from '@oney/saga-core';

export class ActiveSagaMapper {
  private _registry: SagaRegistry;
  private _activator: SagaActivator;

  constructor(activator: SagaActivator, registry: SagaRegistry) {
    this._activator = activator;
    this._registry = registry;
  }

  toPersistence<TSagaState extends SagaState>(saga: ActiveSaga<TSagaState>): ActiveSagaDataModel<TSagaState> {
    return {
      activeSagaId: saga.activeSagaId,
      definition: saga.definition.toJSON(),
      instance: saga.instance,
      history: saga.history,
      createdAt: saga.createdAt,
      updatedAt: saga.updatedAt,
    };
  }

  toModel<TSagaState extends SagaState>(saga: ActiveSagaDataModel<TSagaState>): ActiveSaga<TSagaState> {
    const sagaId = saga.definition.saga;

    const { definition } = this._registry.find<TSagaState>(sagaId.namespace, sagaId.id, sagaId.version);

    const history = saga.history.map(x => {
      // todo make a real event instance, or in history use an only json object ?
      // todo manage generic from mongoose model
      const history = new ActiveSagaHistoryEntry<TSagaState, Event>(x.beforeState as TSagaState, x.event);
      history.afterState = x.afterState as TSagaState;
      history.executedAt = x.executedAt;
      return history;
    });

    // todo maybe not a good place to call activator ?
    const instance = this._activator.activate<TSagaState>(definition.target);
    instance.completedAt = saga.instance.completedAt;
    instance.state = saga.instance.state;

    return new ActiveSaga<TSagaState>({
      activeSagaId: saga.activeSagaId,
      definition: definition,
      instance: instance,
      history: history,
      updatedAt: saga.updatedAt,
      createdAt: saga.createdAt,
    });
  }
}

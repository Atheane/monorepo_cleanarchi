import { Event } from '@oney/messages-core';
import { EventCtor } from '@oney/messages-core';
import { ActiveSaga, SagaFinder, SagaRegistry, SagaState, SagaWorkflowCtor } from '@oney/saga-core';
import { InMemorySagaCollection } from './InMemorySagaCollection';

export class InMemorySagaFinder extends SagaFinder {
  private _registry: SagaRegistry;
  private _collection: InMemorySagaCollection;

  constructor(registry: SagaRegistry, collection: InMemorySagaCollection) {
    super();

    this._registry = registry;
    this._collection = collection;
  }

  public findActiveSagasBySaga<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
  ): Promise<ActiveSaga<TSagaState>[]> {
    const collection = this._collection.readActive();
    const entry = this._registry.findByCtor(saga);
    const definition = entry.definition;

    const results = collection.filter(
      x =>
        x.definition.id === definition.id &&
        x.definition.namespace === definition.namespace &&
        x.definition.version === definition.version &&
        x.instance.completedAt == null,
    ) as ActiveSaga<TSagaState>[];

    return Promise.resolve(results);
  }

  public findCompletedSagasBySaga<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
  ): Promise<ActiveSaga<TSagaState>[]> {
    const collection = this._collection.readActive();
    const entry = this._registry.findByCtor(saga);
    const definition = entry.definition;

    const results = collection.filter(
      x =>
        x.definition.id === definition.id &&
        x.definition.namespace === definition.namespace &&
        x.definition.version === definition.version &&
        x.instance.completedAt != null,
    ) as ActiveSaga<TSagaState>[];

    return Promise.resolve(results);
  }

  public findSagaStartedByEvent(event: Event): Promise<Array<SagaWorkflowCtor>> {
    const registry = this._registry.read();

    const definitions = registry.map(x => x.definition);

    // todo remove this as any, find how typed the constructor
    const startedBySagas = definitions.filter(x => x.isStartedBy(event.constructor as EventCtor<Event>));

    // todo check with configured property map

    const result = startedBySagas.map(x => x.target);

    return Promise.resolve(result);
  }

  public async findActiveSagaStartedByEvent<TSagaState extends SagaState>(
    event: Event,
  ): Promise<ActiveSaga<TSagaState>[]> {
    const registry = this._registry.read();

    const definitions = registry.map(x => x.definition);

    const handleBySagas = definitions.filter(x => x.isStartedBy(event.constructor as EventCtor<Event>));

    const results = [];
    for (const definition of handleBySagas) {
      const activeSagas = await this.findActiveSagasBySaga(definition.target);
      for (const activeSaga of activeSagas) {
        const fromEventValue = definition.startedByDefinition.fromEventSelect(event);
        const fromStateValue = definition.startedByDefinition.toSagaSelect(activeSaga.instance.state);

        // check from the configured correlation map
        if (fromEventValue === fromStateValue) {
          results.push(activeSaga);
        }
      }
    }

    return results;
  }
}

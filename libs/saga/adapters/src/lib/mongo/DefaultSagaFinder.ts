import { EventCtor, Event } from '@oney/messages-core';
import {
  ActiveSaga,
  ActiveSagaRepository,
  FindOptions,
  SagaFinder,
  SagaRegistry,
  SagaState,
  SagaWorkflowCtor,
} from '@oney/saga-core';
import { ActiveSagaMapper } from './mongodb/ActiveSagaMapper';

export class DefaultSagaFinder extends SagaFinder {
  private _registry: SagaRegistry;
  private _repository: ActiveSagaRepository;
  private _mapper: ActiveSagaMapper;

  constructor(registry: SagaRegistry, repository: ActiveSagaRepository, mapper: ActiveSagaMapper) {
    super();

    this._repository = repository;
    this._registry = registry;
    this._mapper = mapper;
  }

  public async findActiveSagasBySaga<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
  ): Promise<ActiveSaga<TSagaState>[]> {
    const { definition } = this._registry.findByCtor(saga);

    const results = await this._repository.find<TSagaState>(
      definition.namespace,
      definition.id,
      definition.version,
      FindOptions.NOT_COMPLETED,
    );

    return results.map(x => this._mapper.toModel(x));
  }

  public async findCompletedSagasBySaga<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
  ): Promise<ActiveSaga<TSagaState>[]> {
    const { definition } = this._registry.findByCtor(saga);

    const results = await this._repository.find<TSagaState>(
      definition.namespace,
      definition.id,
      definition.version,
      FindOptions.COMPLETED,
    );

    return results.map(x => this._mapper.toModel(x));
  }

  public findSagaStartedByEvent(event: Event): Promise<Array<SagaWorkflowCtor<SagaState>>> {
    const registry = this._registry.read();

    const definitions = registry.map(x => x.definition);

    // todo remove this as any, find how typed the constructor
    const startedBySagas = definitions.filter(x => x.isStartedBy(event.constructor as EventCtor<Event>));

    // todo check with configured property map

    return Promise.resolve(startedBySagas.map(x => x.target));
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

        // todo what we should do when fromEventValue and fromStateValue is undefined

        // check from the configured correlation map
        if (fromEventValue === fromStateValue) {
          results.push(activeSaga);
        }
      }
    }

    return results;
  }
}

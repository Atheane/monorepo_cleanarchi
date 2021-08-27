import { Event } from '@oney/messages-core';
import { EventCtor } from '@oney/messages-core';
import {
  ActiveSaga,
  CorrelatedSagaProvider,
  SagaActivator,
  SagaFinder,
  SagaRegistry,
  SagaState,
  SagaWorkflowCtor,
} from '@oney/saga-core';
import { assert } from 'ts-essentials';
import { v4 } from 'uuid';

export class InMemoryCorrelatedSagaProvider extends CorrelatedSagaProvider {
  private _finder: SagaFinder;
  private _activator: SagaActivator;
  private _registry: SagaRegistry;

  constructor(registry: SagaRegistry, finder: SagaFinder, activator: SagaActivator) {
    super();
    this._registry = registry;
    this._finder = finder;
    this._activator = activator;
  }

  //private checkPendingSagaIntegrity<TSagaState extends SagaState>(activeSagas: ActiveSaga<TSagaState>) {}

  private checkIfActiveSagaHasAlreadyHandledEvent<TSagaState extends SagaState>(
    event: Event,
    saga: ActiveSaga<TSagaState>,
  ) {
    const definition = saga.definition.findDefinitionByEvent(event.constructor as EventCtor<Event>);
    assert(definition);

    const historyEntry = saga.history.some(x => {
      // todo change this by an unique identifier check
      return (
        x.event.constructor === event.constructor &&
        definition.fromEventSelect(x.event) === definition.fromEventSelect(event)
      );
    });

    if (historyEntry) {
      // todo apply already handle strategy
      console.warn(
        'Duplicated handle event detected, Currently the second one will not be executed',
        saga,
        event,
      );

      return true; // hasAlreadyHandled
    }

    return false; // not hasAlreadyHandled
  }

  private async checkIfSagaHasAlreadyBeenStartedBy<TSagaState extends SagaState>(
    event: Event,
    saga: SagaWorkflowCtor<TSagaState>,
  ) {
    // todo it can be optimize
    const sagasAlreadyStartedBy = await this._finder.findActiveSagaStartedByEvent(event);

    // already startedBy saga detected
    if (sagasAlreadyStartedBy.some(x => x.definition.target === saga)) {
      // todo apply already started by strategy
      console.warn(
        'Duplicated started by event detected, Currently the second one will not be started',
        saga.name,
        event,
      );

      return true; // duplicated
    }

    return false; // not duplicated
  }

  public async getCorrelatedActiveSagas<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
    event: Event,
  ): Promise<ActiveSaga<TSagaState>[]> {
    // todo check if startedby or awaited
    const { definition } = await this._registry.findByCtor(saga);
    if (definition.isStartedBy(event.constructor as EventCtor<Event>)) {
      // todo peut on avoir une saga commencant avec cet event et ayant des pendings saga ?

      const hasAlreadyBeenStartedBy = await this.checkIfSagaHasAlreadyBeenStartedBy(event, saga);

      // todo need to check if the next events was already received

      // todo check strategy
      if (!hasAlreadyBeenStartedBy) {
        const instance = await this._activator.activate(saga);

        const activeSaga = new ActiveSaga<TSagaState>({
          activeSagaId: v4(),
          definition: definition,
          instance: instance,
          history: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return [activeSaga];
      }
    } else {
      const activeSagas: ActiveSaga<TSagaState>[] = [];

      // todo doit on en avoir qu'un ? plusieurs saga attendant le meme event ?
      const correlatedPendingSagas = await this.getCorrelatedPendingSagas(saga, event);
      for (const saga of correlatedPendingSagas) {
        const hasAlreadyHandled = await this.checkIfActiveSagaHasAlreadyHandledEvent(event, saga);

        // todo check strategy
        if (!hasAlreadyHandled) {
          //const activeSaga = this._activator.resume(saga);
          activeSagas.push(saga);
        }
      }

      return activeSagas;
    }
  }

  async getCorrelatedPendingSagas<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
    event: Event,
  ) {
    const results = [];

    const pendingSagas = await this._finder.findActiveSagasBySaga(saga);
    for (const activeSaga of pendingSagas) {
      const handleDefinition = activeSaga.definition.getDefinitionIsHandleBy(
        event.constructor as EventCtor<Event>,
      );

      assert(handleDefinition, 'definition should be defined');

      const fromEventValue = handleDefinition.fromEventSelect(event);
      const fromStateValue = handleDefinition.toSagaSelect(activeSaga.instance.state);

      // check from the configured correlation map
      if (fromEventValue === fromStateValue) {
        results.push(activeSaga);
      }
    }

    return results;
  }
}

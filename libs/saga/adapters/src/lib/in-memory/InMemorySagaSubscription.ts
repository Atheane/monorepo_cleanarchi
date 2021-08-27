import { Event } from '@oney/messages-core';
import {
  CorrelatedSagaProvider,
  SagaExecutionManager,
  SagaMetadata,
  SagaState,
  SagaSubscription,
  SagaWorkflowCtor,
} from '@oney/saga-core';

export class InMemorySagaSubscription extends SagaSubscription {
  private _saga: SagaWorkflowCtor<SagaState>;
  private _correlatedSagaProvider: CorrelatedSagaProvider;
  private _executionManager: SagaExecutionManager;

  constructor(
    saga: SagaWorkflowCtor<SagaState>,
    executionManager: SagaExecutionManager,
    correlatedSagaProvider: CorrelatedSagaProvider,
  ) {
    super();
    this._saga = saga;
    this._executionManager = executionManager;
    this._correlatedSagaProvider = correlatedSagaProvider;
  }

  get events() {
    const definition = SagaMetadata.getSagaDefinitionFromCtor(this._saga);
    return definition.events;
  }

  public async handle(event: Event) {
    const activeSagas = await this._correlatedSagaProvider.getCorrelatedActiveSagas(this._saga, event);

    await this._executionManager.execute(event, activeSagas);
  }
}

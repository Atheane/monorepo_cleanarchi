import {
  CorrelatedSagaProvider,
  SagaExecutionManager,
  SagaState,
  SagaSubscription,
  SagaSubscriptionProvider,
  SagaWorkflowCtor,
} from '@oney/saga-core';
import { InMemorySagaSubscription } from './InMemorySagaSubscription';

export class InMemorySagaSubscriptionProvider extends SagaSubscriptionProvider {
  private _executionManager: SagaExecutionManager;
  private _correlatedProvider: CorrelatedSagaProvider;

  constructor(executionManager: SagaExecutionManager, correlatedProvider: CorrelatedSagaProvider) {
    super();
    this._executionManager = executionManager;
    this._correlatedProvider = correlatedProvider;
  }

  public provide(saga: SagaWorkflowCtor<SagaState>): SagaSubscription {
    return new InMemorySagaSubscription(saga, this._executionManager, this._correlatedProvider);
  }
}

import { SagaState } from './models/SagaState';
import { SagaSubscription } from './SagaSubscription';
import { SagaWorkflowCtor } from './types/SagaWorkflowCtor';

export abstract class SagaSubscriptionProvider {
  abstract provide(saga: SagaWorkflowCtor<SagaState>): SagaSubscription;
}

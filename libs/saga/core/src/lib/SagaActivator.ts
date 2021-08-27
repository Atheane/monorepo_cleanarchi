import { SagaState } from './models/SagaState';
import { SagaWorkflow } from './models/SagaWorkflow';
import { SagaWorkflowCtor } from './types/SagaWorkflowCtor';

export abstract class SagaActivator {
  abstract activate<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
  ): SagaWorkflow<TSagaState>;
}

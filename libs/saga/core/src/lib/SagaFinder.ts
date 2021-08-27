import { Event } from '@oney/messages-core';
import { ActiveSaga } from './models/ActiveSaga';
import { SagaState } from './models/SagaState';
import { SagaWorkflowCtor } from './types/SagaWorkflowCtor';

export abstract class SagaFinder {
  // find from registry
  abstract findSagaStartedByEvent(event: Event): Promise<Array<SagaWorkflowCtor<SagaState>>>;

  abstract findActiveSagaStartedByEvent(event: Event): Promise<Array<ActiveSaga<SagaState>>>;

  abstract findActiveSagasBySaga<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
  ): Promise<ActiveSaga<TSagaState>[]>;

  abstract findCompletedSagasBySaga<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
  ): Promise<ActiveSaga<TSagaState>[]>;
}

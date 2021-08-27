import { Event } from '@oney/messages-core';
import { ActiveSaga } from './models/ActiveSaga';
import { SagaState } from './models/SagaState';
import { SagaWorkflowCtor } from './types/SagaWorkflowCtor';

export abstract class CorrelatedSagaProvider {
  abstract getCorrelatedActiveSagas<TSagaState extends SagaState>(
    saga: SagaWorkflowCtor<TSagaState>,
    event: Event,
  ): Promise<ActiveSaga<TSagaState>[]>;
}

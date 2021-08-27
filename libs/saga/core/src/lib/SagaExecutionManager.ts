import { Event } from '@oney/messages-core';
import { ActiveSaga } from './models/ActiveSaga';
import { SagaState } from './models/SagaState';

export abstract class SagaExecutionManager {
  abstract execute(event: Event, activeSagas: ActiveSaga<SagaState>[]): Promise<void>;
}

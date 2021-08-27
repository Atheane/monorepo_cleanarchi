import { SagaState } from '@oney/saga-core';
import { DomainEvent } from '@oney/ddd';

export interface CommandStrategy<T extends SagaState> {
  nextCommand(sagaState: T): DomainEvent;
}

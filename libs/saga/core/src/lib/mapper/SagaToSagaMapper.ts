import { Event } from '@oney/messages-core';
import { SagaState } from '../models/SagaState';
import { SagaHandleDefinition } from '../models/SagaHandleDefinition';

export class SagaToSagaMapper<TSagaState extends SagaState, TEvent extends Event, ReturnType> {
  public definition: SagaHandleDefinition<TSagaState, TEvent>;

  constructor(definition: SagaHandleDefinition<TSagaState, TEvent>) {
    this.definition = definition;
  }

  toSaga(select: (state: TSagaState) => ReturnType): void {
    this.definition.setToSagaSelect(select);
  }
}

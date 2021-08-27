import { Event } from '@oney/messages-core';
import { SagaToSagaMapper } from './SagaToSagaMapper';
import { SagaState } from '../models/SagaState';
import { SagaHandleDefinition } from '../models/SagaHandleDefinition';

export class SagaFromEventMapper<TSagaState extends SagaState, TEvent extends Event> {
  public definition: SagaHandleDefinition<TSagaState, TEvent>;

  constructor(definition: SagaHandleDefinition<TSagaState, TEvent>) {
    this.definition = definition;
  }

  fromEvent<ReturnType>(
    select: (event: TEvent) => ReturnType,
  ): SagaToSagaMapper<TSagaState, TEvent, ReturnType> {
    this.definition.setFromEventSelect(select);

    const toSaga = new SagaToSagaMapper(this.definition);

    return toSaga;
  }
}

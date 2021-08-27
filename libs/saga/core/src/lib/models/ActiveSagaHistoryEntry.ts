import { Event } from '@oney/messages-core';
import { SagaState } from './SagaState';

export class ActiveSagaHistoryEntry<TSagaState extends SagaState, TEvent extends Event> {
  constructor(before: TSagaState, event: TEvent) {
    this.beforeState = before;
    this.event = event;
  }

  executedAt: Date;
  beforeState: TSagaState;
  afterState: TSagaState;
  event: TEvent;
}

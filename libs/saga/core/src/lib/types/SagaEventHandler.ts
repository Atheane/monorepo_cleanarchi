import { Event, EventHandler } from '@oney/messages-core';
import { SagaEventHandle } from './SagaEventHandle';
import { SagaState } from '../models/SagaState';

export interface SagaEventHandler<TEvent extends Event = Event, TSagaState extends SagaState = SagaState>
  extends EventHandler<TEvent> {
  handle: SagaEventHandle<TEvent, TSagaState>;
}

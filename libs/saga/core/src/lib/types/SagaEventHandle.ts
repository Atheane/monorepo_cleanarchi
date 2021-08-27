import { Event } from '@oney/messages-core';
import { AsyncOrSync } from 'ts-essentials';
import { SagaState } from '../models/SagaState';
import { SagaExecutionContext } from '../SagaExecutionContext';

export type SagaEventHandle<TEvent extends Event = Event, TSagaState extends SagaState = SagaState> = (
  event: TEvent,
  context: SagaExecutionContext<TSagaState>,
) => AsyncOrSync<void>;

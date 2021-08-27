import { Event, EventReceiver, SubscriptionInfo } from '@oney/messages-core';
import { SagaState } from './models/SagaState';
import { SagaEventHandler } from './types/SagaEventHandler';

export abstract class SagaEventReceiver extends EventReceiver {
  //abstract subscribe(event: EventCtor<DomainEvent>, handler: SagaEventReceiverHandler);

  abstract subscribe<TEvent extends Event = Event, TSagaState extends SagaState = SagaState>(
    info: SubscriptionInfo,
    eventDomainHandler: SagaEventHandler<TEvent, TSagaState>,
  ): Promise<void>;
}

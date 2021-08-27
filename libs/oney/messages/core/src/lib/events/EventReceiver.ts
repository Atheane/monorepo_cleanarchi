// import { Disposable } from '@oney/core';
// import { Event } from './Event';
// import { EventCtor } from './EventCtor';
// import { EventReceiverHandler } from './EventReceiverHandler';
//
// export abstract class EventReceiver {
//   abstract subscribe(event: EventCtor<Event>, handler: EventReceiverHandler<Event>): Disposable;
// }

import { injectable } from 'inversify';
import { EventCtor } from './EventCtor';
import { EventMessageBodyMapper } from './EventMessageBodyMapper';
import { EventMessageBodySerializer } from './EventMessageBodySerializer';
import { EventHandler } from './handlers/EventHandler';
import { Event } from './Event';

// should be remove, used for the event transition
export interface SubscriptionInfo {
  topic: string;
  event: EventCtor<Event>;
  handlerUniqueIdentifier?: string;
  customMapper?: EventMessageBodyMapper;
  customSerializer?: EventMessageBodySerializer;
}

@injectable()
export abstract class EventReceiver {
  abstract subscribe<T extends Event>(
    info: SubscriptionInfo,
    eventDomainHandler: EventHandler<T>,
  ): Promise<void>;
}

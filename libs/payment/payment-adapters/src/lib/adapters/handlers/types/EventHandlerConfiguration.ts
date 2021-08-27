import { ClassType } from '@oney/common-core';
import { EventReceiver } from '@oney/messages-core';

export interface EventHandlerConfiguration<T> {
  eventReceiver: EventReceiver;
  topic: string;
  event: ClassType<T>;
}

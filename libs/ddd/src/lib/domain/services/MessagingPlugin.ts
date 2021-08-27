import { EventDispatcher, EventReceiver } from '@oney/messages-core';

export interface MessagingPlugin {
  dispatcher: EventDispatcher;
  receiver: EventReceiver;
}

import { MessagingPlugin } from '@oney/ddd';
import { RxEventDispatcher } from './services/RxEventDispatcher';
import { RxEventReceiver } from './services/RxEventReceiver';
import { RxServiceBus } from './services/RxServiceBus';

export function initRxMessagingPlugin(): MessagingPlugin {
  const rxServiceBus = new RxServiceBus();
  return {
    receiver: new RxEventReceiver(rxServiceBus),
    dispatcher: new RxEventDispatcher(rxServiceBus),
  };
}

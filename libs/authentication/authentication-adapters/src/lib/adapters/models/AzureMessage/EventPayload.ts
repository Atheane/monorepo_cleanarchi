import { ServiceBusMessage } from '@azure/service-bus';

export class EventPayload<T> extends ServiceBusMessage {
  body: T;
}

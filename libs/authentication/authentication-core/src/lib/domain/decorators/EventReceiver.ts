import { injectable } from 'inversify';

export const eventMapReceivers = new Map<string, any>();

@injectable()
export abstract class EventConsumer<T = object> {
  abstract consume(data: T): Promise<void>;
}

export function EventReceiver(topic: string) {
  return (target: any) => {
    eventMapReceivers.set(topic, target);
  };
}

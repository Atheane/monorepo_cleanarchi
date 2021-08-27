import { Event } from '@oney/messages-core';
import { v4 } from 'uuid';

export type PayloadOf<TProps extends object> = Omit<EventBase<TProps>, 'id' | 'timestamp'>;

export abstract class EventBase<TProps extends object> implements Event<TProps> {
  public readonly id: string;
  public readonly timestamp: number;
  public readonly props: TProps;

  protected constructor();
  protected constructor(data?: object) {
    this.id = v4();
    this.timestamp = Date.now();
    if (data) {
      for (const key in data) {
        if (key === 'id' || key === 'timestamp') {
          throw new Error(`Cannot override ${key} property`);
        }
        this[key] = data[key];
      }
    }
  }
}

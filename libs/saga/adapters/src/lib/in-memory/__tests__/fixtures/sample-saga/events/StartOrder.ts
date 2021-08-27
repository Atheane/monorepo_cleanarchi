import { DecoratedEvent, Event } from '@oney/messages-core';
import { DeepPartial } from 'ts-essentials';

export type Props = { orderId: string };

@DecoratedEvent({ name: 'StartOrder', namespace: '@oney/saga', version: 0 })
export class StartOrder implements Event<Props> {
  constructor(data?: DeepPartial<StartOrder>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: string;
  public props: Props;
}

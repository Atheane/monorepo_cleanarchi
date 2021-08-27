import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { DeepPartial } from 'ts-essentials';

export type Props = { orderId: string };

@DecoratedEvent({ name: 'StartOrder', namespace: '@oney/saga', version: 0 })
export class StartOrder implements DomainEvent<Props> {
  constructor(data?: DeepPartial<StartOrder>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: string;
  public props: Props;
}

import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { DeepPartial } from 'ts-essentials';

export type Props = { orderId: string };

@DecoratedEvent({ name: 'CompleteOrder', namespace: '@oney/saga', version: 0 })
export class CompleteOrder implements DomainEvent<Props> {
  constructor(data?: DeepPartial<CompleteOrder>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: string;
  public props: Props;
}

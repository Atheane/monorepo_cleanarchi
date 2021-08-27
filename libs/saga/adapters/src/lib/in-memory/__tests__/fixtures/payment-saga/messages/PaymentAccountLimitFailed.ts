import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { DeepPartial } from 'ts-essentials';

@DecoratedEvent({ name: 'PaymentAccountLimitFailed', namespace: '@oney/saga', version: 0 })
export class PaymentAccountLimitFailed implements DomainEvent<{ userId: string }> {
  constructor(data?: DeepPartial<PaymentAccountLimitFailed>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: string;
  public props: { userId: string };
}

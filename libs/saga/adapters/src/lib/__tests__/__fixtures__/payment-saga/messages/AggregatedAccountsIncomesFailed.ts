import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { DeepPartial } from 'ts-essentials';

@DecoratedEvent({
  name: 'AggregatedAccountsIncomesFailed',
  namespace: '@oney/saga',
  version: 0,
})
export class AggregatedAccountsIncomesFailed implements DomainEvent<{ userId: string }> {
  constructor(data?: DeepPartial<AggregatedAccountsIncomesFailed>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public id: string;
  public props: { userId: string };
}

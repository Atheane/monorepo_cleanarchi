import { Event, DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { AggregationEvents } from './AggregationEvents';

export interface AccountSynchronizedProps<T = object, K = object> {
  userId: string;
  account?: T;
  bank?: K;
}

@DecoratedEvent({ version: 1, name: AggregationEvents.ACCOUNT_SYNCHRONIZED, namespace: '@oney/aggregation' })
export class AccountSynchronized<T = object, K = object> implements Event<AccountSynchronizedProps<T, K>> {
  id = uuidV4();

  props: AccountSynchronizedProps<T, K>;

  constructor(props: AccountSynchronizedProps<T, K>) {
    this.props = { ...props };
  }
}

import { AccountSynchronized } from '@oney/aggregation-messages';
import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { injectable } from 'inversify';

@injectable()
export class AccountSynchronizedHandler<T = object, K = object> extends DomainEventHandler<
  AccountSynchronized<T, K>
> {
  public handle(domainEvent: AccountSynchronized<T, K>): Promise<void> {
    return;
  }
}

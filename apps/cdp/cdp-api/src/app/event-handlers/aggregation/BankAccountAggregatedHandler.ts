import { BankAccountAggregated } from '@oney/aggregation-messages';
import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { injectable } from 'inversify';

@injectable()
export class BankAccountAggregatedHandler extends DomainEventHandler<BankAccountAggregated> {
  public handle(domainEvent: BankAccountAggregated): Promise<void> {
    return;
  }
}

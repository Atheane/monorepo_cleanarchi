import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { BankAccountMonthlyAllowanceUpdated } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class BankAccountMonthlyAllowanceUpdatedHandler extends DomainEventHandler<
  BankAccountMonthlyAllowanceUpdated
> {
  public handle(domainEvent: BankAccountMonthlyAllowanceUpdated): Promise<void> {
    return;
  }
}

import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { BankAccountMonthlyAllowanceUpdated, DebtEvents } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../../usecase/RefreshClient';

@injectable()
export class BankAccountMonthlyAllowanceUpdatedHandler extends DomainEventHandler<
  BankAccountMonthlyAllowanceUpdated
> {
  constructor(@inject(Identifiers.RefreshClient) private refreshClient: RefreshClient) {
    super();
  }

  async handle(domainEvent: BankAccountMonthlyAllowanceUpdated): Promise<void> {
    const { aggregateId } = domainEvent.metadata;
    defaultLogger.info(`Received ${DebtEvents.BANK_ACCOUNT_MONTHLY_ALLOWANCE_UPDATED} event`, domainEvent);
    const refreshClientCommand: RefreshClientCommand = {
      userId: aggregateId,
      eventName: DebtEvents.BANK_ACCOUNT_MONTHLY_ALLOWANCE_UPDATED,
      eventDate: new Date(),
      eventPayload: JSON.stringify(domainEvent),
    };
    await this.refreshClient.execute(refreshClientCommand);
  }
}

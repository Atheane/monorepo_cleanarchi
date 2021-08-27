import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { DebtEvents, DebtUpdated } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../../usecase/RefreshClient';

@injectable()
export class PaymentDebtUpdatedHandler extends DomainEventHandler<DebtUpdated> {
  constructor(@inject(Identifiers.RefreshClient) private refreshClient: RefreshClient) {
    super();
  }

  async handle(domainEvent: DebtUpdated): Promise<void> {
    const { userId } = domainEvent.props;
    defaultLogger.info(`Received ${DebtEvents.DEBT_UPDATED} event`, domainEvent);
    const refreshClientCommand: RefreshClientCommand = {
      userId,
      eventName: DebtEvents.DEBT_UPDATED,
      eventDate: new Date(),
      eventPayload: JSON.stringify(domainEvent),
    };
    await this.refreshClient.execute(refreshClientCommand);
  }
}

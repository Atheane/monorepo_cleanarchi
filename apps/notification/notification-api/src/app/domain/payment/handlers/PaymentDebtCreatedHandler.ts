import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { DebtCreated, DebtEvents } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../../usecase/RefreshClient';

@injectable()
export class PaymentDebtCreatedHandler extends DomainEventHandler<DebtCreated> {
  constructor(@inject(Identifiers.RefreshClient) private refreshClient: RefreshClient) {
    super();
  }

  async handle(domainEvent: DebtCreated): Promise<void> {
    const { userId } = domainEvent.props;
    defaultLogger.info(`Received ${DebtEvents.DEBT_CREATED} event`, domainEvent);
    const refreshClientCommand: RefreshClientCommand = {
      userId,
      eventName: DebtEvents.DEBT_CREATED,
      eventDate: new Date(),
      eventPayload: JSON.stringify(domainEvent),
    };
    await this.refreshClient.execute(refreshClientCommand);
  }
}

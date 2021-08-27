import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { BankAccountUncappedFromAggregation } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../../usecase/RefreshClient';

@injectable()
export class BankAccountUncappedFromAggregationHandler extends DomainEventHandler<
  BankAccountUncappedFromAggregation
> {
  constructor(@inject(Identifiers.RefreshClient) private refreshClient: RefreshClient) {
    super();
  }

  async handle(domainEvent: BankAccountUncappedFromAggregation): Promise<void> {
    const { aggregateId, eventName } = domainEvent.metadata;
    defaultLogger.info(`Received ${eventName} event`, domainEvent);
    const refreshClientCommand: RefreshClientCommand = {
      userId: aggregateId,
      eventName,
      eventDate: new Date(),
      eventPayload: JSON.stringify(domainEvent),
    };
    await this.refreshClient.execute(refreshClientCommand);
  }
}

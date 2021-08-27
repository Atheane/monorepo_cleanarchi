import { DomainEventHandler } from '@oney/ddd';
import { AccountSynchronized, AggregationEvents } from '@oney/aggregation-messages';
import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../../usecase/RefreshClient';

@injectable()
export class AccountSynchronizedHandler extends DomainEventHandler<AccountSynchronized> {
  private readonly refreshClient: RefreshClient;

  constructor(@inject(Identifiers.RefreshClient) refreshClient: RefreshClient) {
    super();
    this.refreshClient = refreshClient;
  }

  async handle(domainEvent: AccountSynchronized): Promise<void> {
    const { userId } = domainEvent.props;

    defaultLogger.info(`Received ${AggregationEvents.ACCOUNT_SYNCHRONIZED} event for user ${userId}`);

    const refreshClientCommand: RefreshClientCommand = {
      userId,
      eventName: AggregationEvents.PFM_ACCOUNT_UPDATED,
      eventDate: new Date(),
      eventPayload: JSON.stringify({}),
    };

    await this.refreshClient.execute(refreshClientCommand);
  }
}

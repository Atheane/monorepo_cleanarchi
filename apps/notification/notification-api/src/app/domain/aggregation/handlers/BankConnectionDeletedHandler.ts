import { DomainEventHandler } from '@oney/ddd';
import { BankConnectionDeleted, AggregationEvents } from '@oney/aggregation-messages';
import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../../usecase/RefreshClient';

@injectable()
export class BankConnectionDeletedHandler extends DomainEventHandler<BankConnectionDeleted> {
  private readonly usecase: RefreshClient;

  constructor(@inject(Identifiers.RefreshClient) usecase: RefreshClient) {
    super();
    this.usecase = usecase;
  }

  async handle(domainEvent: BankConnectionDeleted): Promise<void> {
    const { userId, deletedAccountIds } = domainEvent.props;
    defaultLogger.info(
      `Received ${AggregationEvents.BANK_CONNECTION_DELETED} for userId ${userId}, connectionId ${domainEvent.metadata.aggregateId}`,
    );
    const refreshClientCommand: RefreshClientCommand = {
      userId,
      eventName: AggregationEvents.BANK_CONNECTION_DELETED,
      eventDate: new Date(),
      eventPayload: JSON.stringify({
        connectionId: domainEvent.metadata.aggregateId,
        deletedAccountIds,
      }),
    };

    await this.usecase.execute(refreshClientCommand);
  }
}

import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { Events, TransferOutExecuted } from '@oney/notification-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../../usecase/RefreshClient';

@injectable()
export class TransferOutHandler extends DomainEventHandler<TransferOutExecuted> {
  private readonly refreshClient: RefreshClient;

  constructor(@inject(Identifiers.RefreshClient) refreshClient: RefreshClient) {
    super();
    this.refreshClient = refreshClient;
  }

  async handle(domainEvent: TransferOutExecuted): Promise<void> {
    const { userid } = domainEvent.props.callback;

    defaultLogger.info(`Received SCT_OUT_EXECUTED event for user ${userid}`);

    const refreshClientCommand: RefreshClientCommand = {
      userId: userid,
      eventName: Events.SCT_OUT_EXECUTED,
      eventDate: new Date(),
      eventPayload: JSON.stringify(domainEvent),
    };

    await this.refreshClient.execute(refreshClientCommand);
  }
}

import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { CardTransactionReceived } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../../usecase/RefreshClient';

@injectable()
export class CardTransactionHandler extends DomainEventHandler<CardTransactionReceived> {
  private readonly refreshClient: RefreshClient;

  constructor(@inject(Identifiers.RefreshClient) refreshClient: RefreshClient) {
    super();
    this.refreshClient = refreshClient;
  }

  async handle(domainEvent: CardTransactionReceived): Promise<void> {
    const { userId } = domainEvent.props.callback;
    defaultLogger.info(`Received CARD_TRANSACTION_RECEIVED event for user ${userId}`);

    const refreshClientCommand: RefreshClientCommand = {
      userId: userId,
      eventName: 'CARD_TRANSACTION_RECEIVED',
      eventDate: new Date(),
      eventPayload: JSON.stringify(domainEvent),
    };

    await this.refreshClient.execute(refreshClientCommand);
  }
}

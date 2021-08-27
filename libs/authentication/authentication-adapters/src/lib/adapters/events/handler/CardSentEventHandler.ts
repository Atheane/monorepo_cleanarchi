import { inject, injectable } from 'inversify';
import { ProvisionUserCard } from '@oney/authentication-core';
import { DomainEventHandler } from '@oney/ddd';
import { CardSent } from '@oney/payment-messages';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class CardSentEventHandler extends DomainEventHandler<CardSent> {
  constructor(
    @inject(ProvisionUserCard) private readonly _provisionUserCard: ProvisionUserCard,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    super();
  }

  async handle(domainEvent: CardSent): Promise<void> {
    const payload = JSON.stringify(domainEvent.props);
    this._logger.info(`Received message in card sent handler with payload ${payload}`);
    const { cardId, userId, encryptedData } = domainEvent.props;
    const command = { cardId, userId, encryptedData };
    const updatedUser = await this._provisionUserCard.execute(command);
    this._logger.info(`[${userId}] After user card provisioning done: ${updatedUser}`);
  }
}

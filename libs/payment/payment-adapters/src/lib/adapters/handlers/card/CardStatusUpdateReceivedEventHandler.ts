import { DomainEventHandler } from '@oney/ddd';
import { CardStatus, UpdateCardStatus } from '@oney/payment-core';
import { CardStatusUpdateReceived } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class CardStatusUpdateReceivedEventHandler extends DomainEventHandler<CardStatusUpdateReceived> {
  private readonly handlerName: string;
  constructor(
    @inject(UpdateCardStatus)
    private readonly updateCardStatus: UpdateCardStatus,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle(domainEvent: CardStatusUpdateReceived): Promise<void> {
    this.logger.info(`${this.handlerName}: received event with event properties: ${domainEvent}`);
    const { status, userId, reference: cardId } = domainEvent.props;

    this.logger.info(`${this.handlerName}: executing updateCardStatus  usecase for user: ${userId}`);
    await this.updateCardStatus.execute({
      cardId,
      status: CardStatus[status],
      accountId: userId,
    });
  }
}

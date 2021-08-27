import { DomainEventHandler } from '@oney/ddd';
import { CardStatus, CardStatusUpdated } from '@oney/payment-messages';
import { CancelSubscriptionByOfferId, GetSubscriptionByCardId } from '@oney/subscription-core';
import { injectable } from 'inversify';

@injectable()
export class CardStatusUpdatedHandler extends DomainEventHandler<CardStatusUpdated> {
  constructor(
    private readonly _cancelSubscriptionByOfferId: CancelSubscriptionByOfferId,
    private readonly _getSubscriptionByCardId: GetSubscriptionByCardId,
  ) {
    super();
  }

  async handle(domainEvent: CardStatusUpdated): Promise<void> {
    if (domainEvent.props.status === CardStatus.OPPOSED) {
      const subscription = await this._getSubscriptionByCardId.execute({
        cardId: domainEvent.props.id,
      });
      await this._cancelSubscriptionByOfferId.execute({
        subscriberId: subscription.props.subscriberId,
        offerId: subscription.props.offerId,
      });
    }
  }
}

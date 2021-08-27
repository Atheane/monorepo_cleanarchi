import { DomainEventHandler } from '@oney/ddd';
import { GetSubscriptionsBySubscriberId, SubscribeToOffer } from '@oney/subscription-core';
import { SubscriptionCancelled } from '@oney/subscription-messages';
import { inject, injectable } from 'inversify';
import { SubscriptionSyms } from '../../../config/di/SubscriptionSyms';

@injectable()
export class SubscriptionCancelledHandler extends DomainEventHandler<SubscriptionCancelled> {
  constructor(
    private readonly _subscribeToOffer: SubscribeToOffer,
    @inject(SubscriptionSyms.defaultOffer) private readonly _defaultOffer: string,
    private readonly _getSubscriptionBySubscriberId: GetSubscriptionsBySubscriberId,
  ) {
    super();
  }

  async handle(domainEvent: SubscriptionCancelled): Promise<void> {
    const { offerId, subscriberId } = domainEvent.props;
    if (offerId !== this._defaultOffer) {
      await this._subscribeToOffer.execute({
        subscriberId: subscriberId,
        offerId: this._defaultOffer,
      });
    }
    return;
  }
}

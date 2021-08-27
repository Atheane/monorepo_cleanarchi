import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { OfferRepository } from '@oney/subscription-core';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';

export interface UpdateSubscriptionNextBillingDateRequest {
  subscriberId: string;
  offerId: string;
}

@injectable()
export class UpdateSubscriptionNextBillingDate
  implements Usecase<UpdateSubscriptionNextBillingDateRequest, void> {
  constructor(
    @inject(SubscriptionIdentifier.subscriptionRepository)
    private readonly _subscriptionRepository: SubscriptionRepository,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
    @inject(SubscriptionIdentifier.offerRepository)
    private readonly _offerRepository: OfferRepository,
  ) {}

  async execute(request: UpdateSubscriptionNextBillingDateRequest): Promise<void> {
    const { offerId, subscriberId } = request;
    const subscription = await this._subscriptionRepository.getByOfferSubscriber(subscriberId, offerId);
    const offer = await this._offerRepository.getById(offerId);
    if (subscription) {
      subscription.updateNextBillingDate({
        offer,
      });
      await this._subscriptionRepository.save(subscription);
      await this._eventDispatcher.dispatch(subscription);
      return;
    }
  }
}

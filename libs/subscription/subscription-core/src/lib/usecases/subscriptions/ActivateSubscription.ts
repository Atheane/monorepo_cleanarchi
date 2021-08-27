import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { SubscriberRepository } from '@oney/subscription-core';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import { OfferRepository } from '../../domain/repositories/OfferRepository';

export interface ActivateSubscriptionRequest {
  subscriptionId: string;
}

@injectable()
export class ActivateSubscription implements Usecase<ActivateSubscriptionRequest, void> {
  constructor(
    @inject(SubscriptionIdentifier.subscriptionRepository)
    private readonly _subscriptionRepository: SubscriptionRepository,
    @inject(SubscriptionIdentifier.subscriberRepository)
    private readonly _subscriberRepository: SubscriberRepository,
    @inject(SubscriptionIdentifier.offerRepository) private readonly _offerRepository: OfferRepository,
    @inject(EventProducerDispatcher)
    private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: ActivateSubscriptionRequest): Promise<void> {
    const subscription = await this._subscriptionRepository.getById(request.subscriptionId);
    const offer = await this._offerRepository.getById(subscription.props.offerId);
    subscription.activate(offer);
    await this._subscriptionRepository.save(subscription);
    await this._eventDispatcher.dispatch(subscription);
    return;
  }
}

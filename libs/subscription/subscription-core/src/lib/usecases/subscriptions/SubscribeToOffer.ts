import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { SubscriptionErrors } from '@oney/subscription-core';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { OfferRepository } from '../../domain/repositories/OfferRepository';
import { SubscriberRepository } from '../../domain/repositories/SubscriberRepository';
import { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import { Subscription } from '../../domain/aggregates/Subscription';

export interface SubscribeToOfferRequest {
  subscriberId: string;
  offerId: string;
}

@injectable()
export class SubscribeToOffer implements Usecase<SubscribeToOfferRequest, Subscription> {
  constructor(
    @inject(SubscriptionIdentifier.offerRepository) private readonly _offerRepository: OfferRepository,
    @inject(SubscriptionIdentifier.subscriberRepository)
    private readonly _subscriberRepository: SubscriberRepository,
    @inject(SubscriptionIdentifier.subscriptionRepository)
    private readonly _subscriptionRepository: SubscriptionRepository,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: SubscribeToOfferRequest): Promise<Subscription> {
    const { offerId, subscriberId } = request;
    const subscriber = await this._subscriberRepository.getById(subscriberId);
    const existingSubscription = await this._subscriptionRepository.getByOfferSubscriber(
      subscriberId,
      offerId,
    );
    if (existingSubscription && !existingSubscription.props.endDate) {
      throw new SubscriptionErrors.SubscriptionAlreadyExist('SUBSCRIPTION_ALREADY_EXIST');
    }
    const offer = await this._offerRepository.getById(offerId);
    const subscription = subscriber.subscribe(offer);
    await this._subscriptionRepository.save(subscription);
    await this._eventDispatcher.dispatch(subscription);
    return subscription;
  }
}

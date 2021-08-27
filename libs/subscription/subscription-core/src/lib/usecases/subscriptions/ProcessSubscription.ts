import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { EventProducerDispatcher } from '@oney/messages-core';
import { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { OfferRepository } from '../../domain/repositories/OfferRepository';

export interface ProcessSubscriptionRequest {
  subscriptionId: string;
  cardId: string;
}

@injectable()
export class ProcessSubscription implements Usecase<ProcessSubscriptionRequest, void> {
  constructor(
    @inject(SubscriptionIdentifier.subscriptionRepository)
    private readonly _subscriptionRepository: SubscriptionRepository,
    @inject(SubscriptionIdentifier.offerRepository)
    private readonly _offerRepository: OfferRepository,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: ProcessSubscriptionRequest): Promise<void> {
    const { subscriptionId, cardId } = request;
    const subscription = await this._subscriptionRepository.getById(subscriptionId);
    subscription.attachCard({
      cardId: cardId,
    });
    await this._subscriptionRepository.save(subscription);
    await this._eventDispatcher.dispatch(subscription);
    return;
  }
}

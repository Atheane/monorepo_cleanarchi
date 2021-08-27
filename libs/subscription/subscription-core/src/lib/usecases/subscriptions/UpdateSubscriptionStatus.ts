import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { SubscriptionStatus } from '@oney/subscription-messages';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';

export interface UpdateSubscriptionStatusRequest {
  subscriberId: string;
  offerId: string;
  status: SubscriptionStatus;
}

@injectable()
export class UpdateSubscriptionStatus implements Usecase<UpdateSubscriptionStatusRequest, void> {
  constructor(
    @inject(SubscriptionIdentifier.subscriptionRepository)
    private readonly _subscriptionRepository: SubscriptionRepository,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: UpdateSubscriptionStatusRequest): Promise<void> {
    const { offerId, subscriberId, status } = request;
    const subscription = await this._subscriptionRepository.getByOfferSubscriber(subscriberId, offerId);
    subscription.updateStatus({
      status,
    });
    await this._subscriptionRepository.save(subscription);
    await this._eventDispatcher.dispatch(subscription);
    return;
  }
}

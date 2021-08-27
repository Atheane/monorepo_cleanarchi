import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import { Subscription } from '../../domain/aggregates/Subscription';
import { SubscriptionErrors } from '../../..';

export interface CancelSubscriptionByOfferIdRequest {
  subscriberId: string;
  offerId: string;
  immediate?: boolean;
}

@injectable()
export class CancelSubscriptionByOfferId
  implements Usecase<CancelSubscriptionByOfferIdRequest, Subscription> {
  constructor(
    @inject(SubscriptionIdentifier.subscriptionRepository)
    private readonly _subscriptionRepository: SubscriptionRepository,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: CancelSubscriptionByOfferIdRequest): Promise<Subscription> {
    const { offerId, subscriberId, immediate } = request;
    const subscription = await this._subscriptionRepository.getByOfferSubscriber(subscriberId, offerId);
    if (subscription) {
      subscription.cancel(immediate);
      await this._subscriptionRepository.cancelSubscription(subscription);
      await this._eventDispatcher.dispatch(subscription);
      return subscription;
    }
    throw new SubscriptionErrors.SubscriptionNotFound('SUBSCRIPTION_NOT_FOUND');
  }

  async canExecute(identity: Identity, request?: CancelSubscriptionByOfferIdRequest): Promise<boolean> {
    const role = identity.roles.find(item => item.scope.name === ServiceName.subscription);
    return role.permissions.read === Authorization.self && identity.uid === request.subscriberId;
  }
}

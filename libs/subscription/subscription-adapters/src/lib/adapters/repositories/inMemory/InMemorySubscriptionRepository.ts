import { Subscription, SubscriptionErrors, SubscriptionRepository } from '@oney/subscription-core';
import { injectable } from 'inversify';
import { SubscriptionStatus } from '@oney/subscription-messages';

@injectable()
export class InMemorySubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly _store: Map<string, Subscription>) {}

  async save(subscription: Subscription): Promise<Subscription> {
    this._store.set(subscription.props.id, subscription);
    return subscription;
  }

  async getBySubscriberId(subscriberId: string): Promise<Subscription[]> {
    const subscriptions: Subscription[] = [];
    for (const [, value] of this._store) {
      if (value.props.subscriberId === subscriberId) {
        subscriptions.push(value);
      }
    }
    return subscriptions;
  }

  async getDueSubscriptions(): Promise<Subscription[]> {
    const subscriptions: Subscription[] = [];
    for (const [, value] of this._store) {
      if (
        new Date(value.props.nextBillingDate).getTime() <= new Date().getTime() &&
        value.props.status === SubscriptionStatus.ACTIVE
      ) {
        subscriptions.push(value);
      }
    }
    return subscriptions;
  }

  async getById(subscriptionId: string): Promise<Subscription> {
    return this._store.get(subscriptionId);
  }

  async getByOfferSubscriber(subscriberId: string, offerId: string): Promise<Subscription> {
    const subscriptions: Subscription[] = [];
    for (const [, value] of this._store) {
      if (value.props.subscriberId === subscriberId && value.props.offerId === offerId) {
        subscriptions.push(value);
      }
    }
    return subscriptions[0];
  }

  async getInactiveSubscription(subscriberId: string): Promise<Subscription[]> {
    const subscriptions: Subscription[] = [];
    for (const [, value] of this._store) {
      if (value.props.subscriberId === subscriberId && value.props.activationDate == null) {
        subscriptions.push(value);
      }
    }
    return subscriptions;
  }

  async cancelSubscription(subscription: Subscription): Promise<void> {
    this._store.set(subscription.id, subscription);
  }

  async getByCardId(cardId: string): Promise<Subscription> {
    const subscriptions: Subscription[] = [];
    for (const [, value] of this._store) {
      if (value.props.cardId === cardId) {
        subscriptions.push(value);
      }
    }
    if (subscriptions.length <= 0) {
      throw new SubscriptionErrors.SubscriptionNotFound('SUBSCRIPTION_NOT_FOUND');
    }
    return subscriptions[0];
  }
}

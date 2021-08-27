import { Subscription } from '../aggregates/Subscription';

export interface SubscriptionRepository {
  getBySubscriberId(subscriberId: string): Promise<Subscription[]>;
  getByOfferSubscriber(subscriberId: string, offerId: string): Promise<Subscription>;
  getDueSubscriptions(): Promise<Subscription[]>;
  getById(subscriptionId: string): Promise<Subscription>;
  save(subscription: Subscription): Promise<Subscription>;
  getInactiveSubscription(subscriberId: string): Promise<Subscription[]>;
  cancelSubscription(subscription: Subscription): Promise<void>;
  getByCardId(cardId: string): Promise<Subscription>;
}

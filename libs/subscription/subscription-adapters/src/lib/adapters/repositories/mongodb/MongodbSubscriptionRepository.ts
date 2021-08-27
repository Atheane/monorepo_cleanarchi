import { Subscription, SubscriptionErrors, SubscriptionRepository } from '@oney/subscription-core';
import { injectable } from 'inversify';
import { Model } from 'mongoose';
import { SubscriptionStatus } from '@oney/subscription-messages';
import { SubscriptionDoc } from './models/SubscriptionModel';

// We ignore this because we test this implem on the subscription-azf.
/* istanbul ignore next */
@injectable()
export class MongodbSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly _collection: Model<SubscriptionDoc>) {}

  async getBySubscriberId(subscriberId: string): Promise<Subscription[]> {
    const subscriptions = await this._collection.find({
      subscriberId: subscriberId,
    });
    return subscriptions.map(subscription => new Subscription(subscription));
  }

  async getDueSubscriptions(): Promise<Subscription[]> {
    const subscriptions = await this._collection.find({
      nextBillingDate: {
        $lte: new Date(),
      },
      status: SubscriptionStatus.ACTIVE,
    });
    return subscriptions.map(subscription => new Subscription(subscription));
  }

  async save(subscription: Subscription): Promise<Subscription> {
    await this._collection.findOneAndUpdate(
      {
        id: subscription.id,
      },
      {
        $set: {
          id: subscription.id,
          subscriberId: subscription.props.subscriberId,
          offerId: subscription.props.offerId,
          activationDate: subscription.props.activationDate,
          nextBillingDate: subscription.props.nextBillingDate,
          insuranceMembershipId: subscription.props.insuranceMembershipId,
          updatedAt: new Date(),
          cardId: subscription.props.cardId,
          status: subscription.props.status,
        },
      },
      {
        upsert: true,
      },
    );
    return subscription;
  }

  async getByOfferSubscriber(subscriberId: string, offerId: string): Promise<Subscription> {
    const subscription = await this._collection.findOne({
      subscriberId: subscriberId,
      offerId: offerId,
    });
    if (!subscription) {
      return null;
    }
    return new Subscription(subscription);
  }

  async getById(subscriptionId: string): Promise<Subscription> {
    const subscription = await this._collection.findOne({
      id: subscriptionId,
    });
    return new Subscription(subscription);
  }

  async getInactiveSubscription(subscriberId: string): Promise<Subscription[]> {
    const subscriptions = await this._collection.find({
      subscriberId: subscriberId,
      activationDate: null,
    });
    return subscriptions.map(item => new Subscription(item));
  }

  async cancelSubscription(subscription: Subscription): Promise<void> {
    await this._collection.findOneAndUpdate(
      {
        id: subscription.id,
      },
      {
        endDate: subscription.props.endDate,
        status: subscription.props.status,
      },
    );
  }

  async getByCardId(cardId: string): Promise<Subscription> {
    const subscription = await this._collection.findOne({
      cardId,
    });
    if (!subscription) {
      throw new SubscriptionErrors.SubscriptionNotFound('SUBSCRIPTION_NOT_FOUND');
    }
    return new Subscription(subscription);
  }
}

import { Subscriber, SubscriberErrors, SubscriberRepository } from '@oney/subscription-core';
import { Model } from 'mongoose';
import { injectable } from 'inversify';
import { SubscriberDoc } from './models/SubscriberModel';

// We ignore this because we test this implem on the subscription-azf.
/* istanbul ignore next */
@injectable()
export class MongodbSubscriberRepository implements SubscriberRepository {
  constructor(private readonly _collection: Model<SubscriberDoc>) {}

  async save(subscriber: Subscriber): Promise<void> {
    await this._collection.findOneAndUpdate(
      {
        uid: subscriber.props.uid,
      },
      {
        $set: {
          uid: subscriber.props.uid,
          customerType: subscriber.props.customerType,
          activatedAt: subscriber.props.activatedAt,
          updatedAt: new Date(),
        },
      },
      {
        upsert: true,
      },
    );
  }

  async getById(uid: string): Promise<Subscriber> {
    const result = await this._collection.findOne({
      uid: uid,
    });
    if (!result) {
      throw new SubscriberErrors.SubscriberNotFound('SUBSCRIBER_NOT_FOUND');
    }
    return new Subscriber(result);
  }

  async exist(uid: string): Promise<boolean> {
    const result = await this._collection.findOne({
      uid: uid,
    });
    return result !== null;
  }
}

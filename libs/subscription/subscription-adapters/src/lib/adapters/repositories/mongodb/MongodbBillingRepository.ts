import { Bill, BillingRepository } from '@oney/subscription-core';
import { Model } from 'mongoose';
import { injectable } from 'inversify';
import { BillDoc } from './models/BillModel';

// We ignore this because we test this implem on the subscription-azf.
/* istanbul ignore next */
@injectable()
export class MongodbBillingRepository implements BillingRepository {
  constructor(private readonly _collection: Model<BillDoc>) {}

  async save(bill: Bill): Promise<Bill> {
    await this._collection.findOneAndUpdate(
      {
        orderId: bill.props.orderId,
      },
      {
        $set: {
          subscriptionId: bill.props.subscriptionId,
          offerId: bill.props.offerId,
          orderId: bill.props.orderId,
          payedAt: bill.props.payedAt,
          billedAt: bill.props.billedAt,
          period: bill.props.period,
          amount: bill.props.amount,
          updatedAt: new Date(),
          ref: bill.props.ref,
          uid: bill.props.uid,
        },
      },
      {
        upsert: true,
      },
    );
    return bill;
  }

  async getBySubscriptionId(subscriptionId: string): Promise<Bill[]> {
    const bills = await this._collection.find({
      subscriptionId: subscriptionId,
    });
    return bills.map(item => new Bill(item));
  }

  async getDueBills(): Promise<Bill[]> {
    const bills = await this._collection.find({
      payedAt: null,
    });
    return bills.map(item => new Bill(item));
  }
}

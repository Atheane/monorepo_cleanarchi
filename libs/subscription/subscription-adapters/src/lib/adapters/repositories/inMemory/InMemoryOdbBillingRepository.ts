import { Bill, BillingRepository } from '@oney/subscription-core';
import { injectable } from 'inversify';

@injectable()
export class InMemoryOdbBillingRepository implements BillingRepository {
  constructor(private readonly _db: Map<string, Bill>) {}

  async save(bill: Bill): Promise<Bill> {
    this._db.set(bill.props.orderId, bill);
    return bill;
  }

  async getBySubscriptionId(subscriptionId: string): Promise<Bill[]> {
    const bills = [];
    for (const [, value] of this._db) {
      if (value.props.subscriptionId === subscriptionId) {
        bills.push(value);
      }
    }
    return bills;
  }

  async getDueBills(): Promise<Bill[]> {
    const bills = [];
    for (const [, value] of this._db) {
      if (value.props.payedAt == null) {
        bills.push(value);
      }
    }
    return bills;
  }
}

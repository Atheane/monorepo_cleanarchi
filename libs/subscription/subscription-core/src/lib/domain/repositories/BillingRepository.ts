import { Bill } from '../aggregates/Bill';

export interface BillingRepository {
  save(bill: Bill): Promise<Bill>;
  getBySubscriptionId(subscriptionId: string): Promise<Bill[]>;
  getDueBills(): Promise<Bill[]>;
}

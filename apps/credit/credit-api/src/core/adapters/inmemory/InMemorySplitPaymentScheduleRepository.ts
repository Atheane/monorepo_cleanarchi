import { injectable } from 'inversify';
import {
  SplitPaymentScheduleError,
  SplitPaymentScheduleRepository,
  SplitPaymentScheduleProperties,
} from '@oney/credit-core';

@injectable()
export class InMemorySplitPaymentScheduleRepository implements SplitPaymentScheduleRepository {
  constructor(private store: Map<string, SplitPaymentScheduleProperties>) {}

  save(paymentSchedule: SplitPaymentScheduleProperties): Promise<SplitPaymentScheduleProperties> {
    this.store.set(paymentSchedule.id, paymentSchedule);

    return Promise.resolve(paymentSchedule);
  }

  async getByContractNumber(contractNumber: string): Promise<SplitPaymentScheduleProperties> {
    const result = [...this.store.values()].filter(entry => entry.contractNumber === contractNumber);
    if (result.length) {
      return Promise.resolve(result[0]);
    }
    return Promise.reject(new SplitPaymentScheduleError.NotFound());
  }

  getByUserId(userId: string): Promise<SplitPaymentScheduleProperties[]> {
    const result = [...this.store.values()].filter(entry => entry.userId === userId);

    return Promise.resolve(result);
  }
}

import { AggregatedAccountsIncomesCheckedCommand, CdpEventError } from '../models';
import { IAggregatedAccountsIncomesCheckedPayload } from '../types';

export class ValidAggregatedAccountsIncomesPayload {
  constructor(private payload: IAggregatedAccountsIncomesCheckedPayload) {}

  async validate(): Promise<void> {
    try {
      const payload = AggregatedAccountsIncomesCheckedCommand.setProperties(this.payload);
      await payload.validate();
    } catch (err) {
      throw new CdpEventError.InvalidPayload(err);
    }
  }
}

import { IAccountEligibilityCalculatedPayload } from '../types';
import { CdpEventError, AccountEligibilityCalculatedCommand } from '../models';

export class ValidAccountEligibilityPayload {
  constructor(private payload: IAccountEligibilityCalculatedPayload) {}

  async validate(): Promise<void> {
    try {
      const payload = AccountEligibilityCalculatedCommand.setProperties(this.payload);
      await payload.validate();
    } catch (err) {
      throw new CdpEventError.InvalidPayload(err);
    }
  }
}

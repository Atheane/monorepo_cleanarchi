import { IPreEligibilityOKPayload } from '../types';
import { CdpEventError, PreEligibilityOKCommand } from '../models';

export class ValidPreEligibilityPayload {
  constructor(private payload: IPreEligibilityOKPayload) {}

  async validate(): Promise<void> {
    try {
      const payload = PreEligibilityOKCommand.setProperties(this.payload);
      await payload.validate();
    } catch (err) {
      throw new CdpEventError.InvalidPayload(err);
    }
  }
}

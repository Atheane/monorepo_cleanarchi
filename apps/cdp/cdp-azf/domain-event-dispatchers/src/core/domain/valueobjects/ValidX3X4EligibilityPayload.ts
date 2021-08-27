import { IX3X4EligibilityCalculatedPayload } from '../types';
import { CdpEventError, X3X4EligibilityCalculatedCommand } from '../models';

export class ValidX3X4EligibilityPayload {
  constructor(private payload: IX3X4EligibilityCalculatedPayload) {}

  async validate(): Promise<void> {
    try {
      const payload = X3X4EligibilityCalculatedCommand.setProperties(this.payload);
      await payload.validate();
    } catch (err) {
      throw new CdpEventError.InvalidPayload(err);
    }
  }
}

import { CdpEventError, CustomBalanceLimitCalculatedCommand } from '../models';
import { ICustomBalanceLimitCalculatedPayload } from '../types/ICustomBalanceLimitCalculatedPayload';

export class ValidCustomBalanceLimitPayload {
  constructor(private payload: ICustomBalanceLimitCalculatedPayload) {}

  async validate(): Promise<void> {
    try {
      const payload = CustomBalanceLimitCalculatedCommand.setProperties(this.payload);
      await payload.validate();
    } catch (err) {
      throw new CdpEventError.InvalidPayload(err);
    }
  }
}

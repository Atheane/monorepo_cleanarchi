import { ClearingBatchCallbackError } from '../../../models/errors/PaymentErrors';
import { ClearingBatchCallbackCommand } from '../../../models/commands/ClearingBatchCallbackCommand';
import { ClearingBatchCallbackPayloadProperties } from './ClearingBatchCallbackPayloadProperties';

export class ClearingBatchCallbackPayload {
  public props: ClearingBatchCallbackPayloadProperties;

  constructor(clearingBatchPayloadProps: ClearingBatchCallbackPayloadProperties) {
    this.props = {
      ...clearingBatchPayloadProps,
    };
  }

  async sanitize(): Promise<void> {
    try {
      const payload = ClearingBatchCallbackCommand.setProperties(this.props);
      await payload.validate();
    } catch (err) {
      throw new ClearingBatchCallbackError.InvalidCallbackPayload(err);
    }
  }
}

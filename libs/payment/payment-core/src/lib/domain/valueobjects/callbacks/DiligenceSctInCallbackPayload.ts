import { DiligenceSctInReceivedProps } from '@oney/payment-messages';
import { DiligenceSctInCallbackCommand } from '../../../models/commands/DiligenceSctInCallbackCommand';
import { DiligenceSctInCallbackError } from '../../../models/errors/PaymentErrors';

export class DiligenceSctInCallbackPayload {
  public props: DiligenceSctInReceivedProps;

  constructor(diligenceSctInPayloadProps: DiligenceSctInReceivedProps) {
    this.props = {
      ...diligenceSctInPayloadProps,
    };
  }

  async sanitize(): Promise<void> {
    try {
      const payload = DiligenceSctInCallbackCommand.setProperties(this.props);
      await payload.validate();
    } catch (err) {
      throw new DiligenceSctInCallbackError.InvalidCallbackPayload(err);
    }
  }
}

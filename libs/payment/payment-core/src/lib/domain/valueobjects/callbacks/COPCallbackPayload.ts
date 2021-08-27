import { CardOperationCallbackError } from '../../../models/errors/PaymentErrors';
import { COPCallbackCommand } from '../../../models/commands/COPCallbackCommand';
import { COPCallbackPayloadProperties } from './COPCallbackPayloadProperties';

export class COPCallbackPayload {
  public props: COPCallbackPayloadProperties;

  constructor(copPayloadProps: COPCallbackPayloadProperties) {
    this.props = {
      ...copPayloadProps,
    };
  }

  async sanitize(): Promise<void> {
    try {
      const payload = COPCallbackCommand.setProperties(this.props);
      await payload.validate();
    } catch (err) {
      throw new CardOperationCallbackError.InvalidCallbackPayload(err);
    }
  }
}

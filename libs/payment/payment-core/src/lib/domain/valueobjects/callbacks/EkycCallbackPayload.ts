import { EkycCallbackCommand } from '../../../models/commands/EkycCallbackCommand';
import { KycCallbackError } from '../../../models/errors/PaymentErrors';
import { CallbackType } from '../../types/CallbackType';
import { Diligences } from '../Diligences';

export interface EkycCallbackPayloadProperties {
  id: string;
  type: CallbackType;
  userId: string;
  status: string;
  diligences: Diligences[];
}

export class EkycCallbackPayload {
  public props: EkycCallbackPayloadProperties;

  constructor(KycCallbackPayloadProps: EkycCallbackPayloadProperties) {
    this.props = {
      ...KycCallbackPayloadProps,
    };
  }

  async sanitize(): Promise<void> {
    try {
      const payload = EkycCallbackCommand.setProperties(this.props);
      await payload.validate();
    } catch (err) {
      throw new KycCallbackError.InvalidCallbackPayload(err);
    }
  }
}

import { LcbFtCallbackCommand } from '../../../models/commands/LcbFtCallbackCommand';
import { KycCallbackError } from '../../../models/errors/PaymentErrors';
import { CallbackType } from '../../types/CallbackType';
import { LcbFtRiskLevel } from '../../types/LcbFtRiskLevel';

export interface LcbFtCallbackPayloadProperties {
  type: CallbackType;
  eventDate: string;
  appUserId: string;
  riskLevel: LcbFtRiskLevel;
}

export class LcbFtCallbackPayload {
  public props: LcbFtCallbackPayloadProperties;

  constructor(KycCallbackPayloadProps: LcbFtCallbackPayloadProperties) {
    this.props = {
      ...KycCallbackPayloadProps,
    };
  }

  async sanitize(): Promise<void> {
    try {
      const payload = LcbFtCallbackCommand.setProperties(this.props);
      await payload.validate();
    } catch (err) {
      throw new KycCallbackError.InvalidCallbackPayload(err);
    }
  }
}

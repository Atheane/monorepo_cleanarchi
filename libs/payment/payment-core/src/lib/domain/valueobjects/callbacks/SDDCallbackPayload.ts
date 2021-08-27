import { AggregateRoot } from '@oney/ddd';
import { SDDReceived } from '@oney/payment-messages';
import { SDDCallbackCommand } from '../../../models/commands/SDDCallbackCommand';
import { SDDCallbackError } from '../../../models/errors/PaymentErrors';
import { CallbackType } from '../../types/CallbackType';

export interface SDDCallbackPayloadProperties {
  id: string;
  reference: string;
  type: CallbackType;
  status: string;
  userid: string;
}

export class SDDCallbackPayload extends AggregateRoot<SDDCallbackPayloadProperties> {
  public props: SDDCallbackPayloadProperties;

  constructor(sddPayloadProps: SDDCallbackPayloadProperties) {
    super(sddPayloadProps.id);
    this.props = {
      ...sddPayloadProps,
    };
  }

  async sanitize(): Promise<void> {
    try {
      const payload = SDDCallbackCommand.setProperties(this.props);
      await payload.validate();
    } catch (err) {
      throw new SDDCallbackError.InvalidCallbackPayload(err);
    }
  }

  public static sddReceived(callbackPayload: SDDCallbackPayload): SDDCallbackPayload {
    callbackPayload.addDomainEvent(new SDDReceived(callbackPayload.props));
    return callbackPayload;
  }
}

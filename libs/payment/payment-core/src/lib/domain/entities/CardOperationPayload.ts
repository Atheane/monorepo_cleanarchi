import { AggregateRoot } from '@oney/ddd';
import { CallbackType, SDDReceived } from '@oney/payment-messages';
import { CardOperationCallbackError } from '../../models/errors/PaymentErrors';
import { SDDCallbackCommand } from '../../models/commands/SDDCallbackCommand';

export interface CardOperationPayloadProperties {
  id: string;
  reference: string;
  type: CallbackType;
  status: string;
  userid: string;
}

export class CardOperationPayload extends AggregateRoot<CardOperationPayloadProperties> {
  public props: CardOperationPayloadProperties;

  constructor(sddPayloadProps: CardOperationPayloadProperties) {
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
      throw new CardOperationCallbackError.InvalidCallbackPayload(err);
    }
  }

  public static sddReceived(callbackPayload: CardOperationPayload): CardOperationPayload {
    callbackPayload.addDomainEvent(new SDDReceived(callbackPayload.props));
    return callbackPayload;
  }
}

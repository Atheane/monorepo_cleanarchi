import { Entity } from '@oney/ddd';
import { CallbackType } from '@oney/payment-messages';

export interface RawCallbackPayloadProperties {
  id: string;
  type: CallbackType;
  date: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export class RawCallbackPayload extends Entity<RawCallbackPayloadProperties> {
  public props: RawCallbackPayloadProperties;

  constructor(props: RawCallbackPayloadProperties) {
    super(props.id);
    this.props = {
      ...props,
    };
  }
}

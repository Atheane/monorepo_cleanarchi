import { AggregateRoot, Handle } from '@oney/ddd';
import { PhoneOtpCreated, PhoneOtpUpdated } from '@oney/profile-messages';

export interface OtpProperties {
  uid: string;
  codeHash: string;
  phone: string;
  creationAttempts: number;
  createdAt: string;
  updatedAt: string;
}

export class Otp extends AggregateRoot<OtpProperties> {
  props: OtpProperties;

  constructor(props: OtpProperties) {
    super(props.uid);
    this.props = props;
  }

  createPhoneOtp(code: string) {
    this.applyChange(
      new PhoneOtpCreated({
        uid: this.props.uid,
        phone: this.props.phone,
        code,
      }),
    );
  }

  @Handle(PhoneOtpCreated) applyPhoneOtpCreated(event: PhoneOtpCreated): void {
    this.props.uid = event.props.uid;
    this.props.phone = event.props.phone;
  }

  updatePhoneOtp(code: string, codeHash: string) {
    this.props.codeHash = codeHash;
    this.props.updatedAt = new Date().toISOString();
    this.applyChange(
      new PhoneOtpUpdated({
        uid: this.props.uid,
        phone: this.props.phone,
        code,
      }),
    );
    return this;
  }

  @Handle(PhoneOtpUpdated) applyPhoneOtpUpdated(event: PhoneOtpUpdated): void {
    this.props.uid = event.props.uid;
    this.props.phone = event.props.phone;
    this.props.updatedAt = new Date().toISOString();
  }

  resetCreationAttempts() {
    this.props.creationAttempts = 1;
    return this;
  }

  incrementCreationAttempts() {
    this.props.creationAttempts++;
    return this;
  }
}

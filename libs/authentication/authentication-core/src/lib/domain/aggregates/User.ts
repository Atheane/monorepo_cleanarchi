import { PartialExceptFor, PublicProperties } from '@oney/common-core';
import { AggregateRoot, Handle } from '@oney/ddd';
import {
  UserSignedUp,
  UserSignedUpProperties,
  PhoneProvisioned,
  PhoneProvisionedProperties,
  CardProvisioned,
  CardProvisionedProperties,
  TrustedDeviceReset,
  DeviceTrusted,
  DeviceTrustedProperties,
  UserPasswordCreated,
  TrustedDeviceResetProperties,
  UserBlocked,
} from '@oney/authentication-messages';
import * as moment from 'moment';
import { UserAuthenticationMode } from '../models/UserAuthenticationMode';
import { AuthFactor } from '../types/AuthFactor';
import { Channel } from '../types/Channel';
import { Provisioning } from '../valueobjects/Provisioning';
import { PinCode } from '../valueobjects/PinCode';
import { HashedCardPan } from '../valueobjects/HashedCardPan';
import { Email } from '../valueobjects/Email';
import { Password } from '../valueobjects/Password';

export interface UserProperties {
  uid: string;

  email?: Email;

  phone?: string;

  pinCode?: PublicProperties<PinCode>;

  metadata?: Record<any, any>;

  provisioning?: Provisioning;

  hashedCardPans?: HashedCardPan[];

  password?: string;

  blockedAt?: Date;
}

export class User extends AggregateRoot<UserProperties> {
  props: UserProperties;

  constructor(props: PartialExceptFor<UserProperties, 'uid'>) {
    super(props.uid);
    this.props = { ...props };
  }

  getUserAuthenticationMode(byPassPinCode?: boolean): UserAuthenticationMode {
    if (this.props.password) {
      return {
        authFactor: AuthFactor.PASSWORD,
        channel: null,
      };
    }
    if (this.props.pinCode?.value && !byPassPinCode) {
      return {
        authFactor: AuthFactor.PIN_CODE,
        channel: null,
      };
    }
    if (this.props.phone) {
      return {
        authFactor: AuthFactor.OTP,
        channel: Channel.SMS,
      };
    }
    return {
      authFactor: AuthFactor.OTP,
      channel: Channel.EMAIL,
    };
  }

  static signUp(props: UserSignedUpProperties): User {
    const user = new User({ ...props, email: Email.from(props.email) });
    user.applyChange(new UserSignedUp(props));
    return user;
  }

  @Handle(UserSignedUp)
  applySignUp({ props }: UserSignedUp): void {
    this.props = { ...props, email: Email.from(props.email) };
  }

  validatePassword(props: { password: string }): string {
    return Password.validate(props.password);
  }

  createUserPassword(props: { password: string }): this {
    this.applyChange(
      new UserPasswordCreated({
        password: props.password,
      }),
    );
    return this;
  }

  @Handle(UserPasswordCreated)
  private applyUserPasswordCreated(event: UserPasswordCreated) {
    this.props.password = event.props.password;
  }

  provisionPhone(props: PhoneProvisionedProperties): User {
    this.applyChange(new PhoneProvisioned(props));
    return this;
  }

  @Handle(PhoneProvisioned)
  applyProvisionPhone(event: PhoneProvisioned): void {
    const { phone, phoneProvisioning } = event.props;
    this.props.phone = phone;
    this.props.provisioning = { ...this.props.provisioning, ...phoneProvisioning };
  }

  provisionCard(props: CardProvisionedProperties): User {
    this.applyChange(new CardProvisioned(props));
    return this;
  }

  @Handle(CardProvisioned)
  applyProvisionCard(event: CardProvisioned): void {
    const { cardProvisioning, hashedCardPan } = event.props;
    const existingHashedCardPans = this.props.hashedCardPans ?? [];
    const updatedHashedCardPans = [...existingHashedCardPans, hashedCardPan];
    const updateDedupled = [...new Set(updatedHashedCardPans)];
    this.props.hashedCardPans = updateDedupled;
    this.props.provisioning = { ...this.props.provisioning, ...cardProvisioning };
  }

  resetTrustedDevice(props: TrustedDeviceResetProperties): User {
    this.applyChange(new TrustedDeviceReset(props));
    return this;
  }

  @Handle(TrustedDeviceReset)
  applyResetTrustedDevice(): void {
    this.props.pinCode = null;
  }

  trustDevice(props: DeviceTrustedProperties): User {
    this.applyChange(new DeviceTrusted(props));
    return this;
  }

  @Handle(DeviceTrusted)
  applyTrustDevice(event: DeviceTrusted): void {
    this.props.pinCode = event.props;
  }

  toJSON(): UserProperties {
    return this.props;
  }

  toString(): string {
    return JSON.stringify(this);
  }

  block(): this {
    this.applyChange(
      new UserBlocked({
        blockedAt: new Date(),
      }),
    );
    return this;
  }

  @Handle(UserBlocked)
  private applyUserBanned(event: UserBlocked) {
    this.props.blockedAt = event.props.blockedAt;
  }

  isBanned(): boolean {
    const blockedAt = this.props.blockedAt;
    if (!blockedAt) {
      return false;
    }
    return moment(blockedAt).isBefore(new Date());
  }
}

import { AggregateRoot } from '@oney/ddd';
import { PublicProperties } from '@oney/common-core';
import { PinCode, Provisioning } from '@oney/authentication-core';
import { UserDeleted } from '@oney/authentication-messages';

export interface UserProperties {
  uid: string;
  email: string;
  phone: boolean;
  pinCode?: PublicProperties<PinCode>;
  metadata?: Record<any, any>;
  provisioning?: Provisioning;
}

export class User extends AggregateRoot<UserProperties> {
  public props: UserProperties;

  constructor(props: UserProperties) {
    super(props.uid);
    this.props = props;
  }

  delete(): void {
    const { uid } = this.props;
    this.addDomainEvent(new UserDeleted({ uid }));
  }
}

import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { UserEventName } from '../types/UserEventName';
import { PinCode } from '../types/PinCode';
import { Domain } from '../types/Domain';

export interface UserSignedUpProperties {
  uid: string;
  phone: string;
  email: string;
  pinCode: PinCode;
  metadata: object;
}

@DecoratedEvent({ version: 1, name: UserEventName.USER_SIGNED_UP, namespace: Domain.AUTHENTICATION })
export class UserSignedUp implements DomainEvent<UserSignedUpProperties> {
  id: string = uuidv4();
  metadata?: DomainEventMetadata;
  props: UserSignedUpProperties;

  constructor(props: UserSignedUpProperties) {
    this.props = props;
  }
}

import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { UserEventName } from '../types/UserEventName';
import { Domain } from '../types/Domain';

export interface UserSignedInProperties {
  uid: string;
  email: string;
}

@DecoratedEvent({ version: 1, name: UserEventName.USER_SIGNED_IN, namespace: Domain.AUTHENTICATION })
export class UserSignedIn implements DomainEvent<UserSignedInProperties> {
  id: string = uuidv4();
  metadata?: DomainEventMetadata;
  props: UserSignedInProperties;

  constructor(props: UserSignedInProperties) {
    this.props = props;
  }
}

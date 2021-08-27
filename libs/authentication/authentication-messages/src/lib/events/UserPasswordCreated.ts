import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 } from 'uuid';

export interface UserPasswordCreatedProps {
  password: string;
}

@DecoratedEvent({ name: 'USER_PASSWORD_CREATED', namespace: '@oney/authentication', version: 1 })
export class UserPasswordCreated implements DomainEvent<UserPasswordCreatedProps> {
  id = v4();
  props: UserPasswordCreatedProps;
  metadata: DomainEventMetadata;

  constructor(props: UserPasswordCreatedProps) {
    this.props = props;
  }
}

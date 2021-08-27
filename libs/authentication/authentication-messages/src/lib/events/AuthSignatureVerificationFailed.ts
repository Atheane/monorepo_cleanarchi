import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { AuthEventName } from '../types/AuthEventName';
import { Domain } from '../types/Domain';

export interface AuthSignatureVerificationFailedProps {
  uid: string;
  name: string;
  reason: string;
  recipient: string;
}

@DecoratedEvent({
  version: 1,
  name: AuthEventName.AUTH_SIGNATURE_VERIFICATION_FAILED,
  namespace: Domain.AUTHENTICATION,
})
export class AuthSignatureVerificationFailed implements DomainEvent<AuthSignatureVerificationFailedProps> {
  id: string = uuidv4();
  metadata?: DomainEventMetadata;
  props: AuthSignatureVerificationFailedProps;

  constructor(props: AuthSignatureVerificationFailedProps) {
    this.props = props;
  }
}

import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { CountryCode } from './types/CountryCode';

export interface IdentityDocumentValidatedProps {
  nationality: CountryCode;
}

@DecoratedEvent({ version: 1, name: 'IDENTITY_DOCUMENT_VALIDATED', namespace: '@oney/profile' })
export class IdentityDocumentValidated implements DomainEvent<IdentityDocumentValidatedProps> {
  readonly id: string = uuidv4();
  readonly props: IdentityDocumentValidatedProps;
  metadata?: DomainEventMetadata;

  constructor(props: IdentityDocumentValidatedProps) {
    this.props = { ...props };
  }
}

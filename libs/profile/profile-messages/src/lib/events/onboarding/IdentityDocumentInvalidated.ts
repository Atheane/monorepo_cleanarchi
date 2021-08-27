import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';

@DecoratedEvent({ version: 1, name: 'IDENTITY_DOCUMENT_INVALIDATED', namespace: '@oney/profile' })
export class IdentityDocumentInvalidated implements DomainEvent {
  readonly id: string = uuidv4();
  readonly props: object;
}

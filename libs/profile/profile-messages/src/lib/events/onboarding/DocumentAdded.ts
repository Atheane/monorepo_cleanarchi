import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { ProfileDocumentProps } from '@oney/profile-messages';

@DecoratedEvent({ version: 1, name: 'DOCUMENT_ADDED', namespace: '@oney/profile' })
export class DocumentAdded implements DomainEvent<ProfileDocumentProps> {
  readonly id: string = uuidv4();
  readonly props: ProfileDocumentProps;
  readonly metadata?: DomainEventMetadata;

  constructor(props: ProfileDocumentProps) {
    this.props = { ...props };
  }
}

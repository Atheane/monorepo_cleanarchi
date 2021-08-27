import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DomainError } from '@oney/common-core';

@DecoratedEvent({ version: 1, name: 'CIVIL_STATUS_VALIDATION_FAILED', namespace: '@oney/profile' })
export class CivilStatusValidationFailed implements DomainEvent<DomainError> {
  id: string = uuidv4();
  props: DomainError;
  metadata?: DomainEventMetadata;
  constructor(props: DomainError, metadata: DomainEventMetadata) {
    this.props = { ...props };
    this.metadata = { ...metadata };
  }
}

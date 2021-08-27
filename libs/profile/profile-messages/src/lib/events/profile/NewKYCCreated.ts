import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';

export interface NewKYCProps {
  caseReference: string;
  caseId: number;
}

@DecoratedEvent({ version: 1, name: 'NEW_KYC_CREATED', namespace: '@oney/profile' })
export class NewKYCCreated implements DomainEvent<NewKYCProps> {
  id: string = uuidv4();

  props: NewKYCProps;

  metadata: DomainEventMetadata;

  constructor(props: NewKYCProps) {
    this.props = { ...props };
  }
}

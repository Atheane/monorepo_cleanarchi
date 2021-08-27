import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { ProfileConsent } from './types/ProfileConsent';

export interface ConsentUpdatedProps {
  partners: ProfileConsent;
  oney: ProfileConsent;
}

@DecoratedEvent({ version: 1, name: 'CONSENT_UPDATED', namespace: '@oney/profile' })
export class ConsentUpdated implements DomainEvent<ConsentUpdatedProps> {
  id: string = uuidv4();
  props: ConsentUpdatedProps;
  metadata?: DomainEventMetadata;

  constructor(props: ConsentUpdatedProps) {
    this.props = { ...props };
  }
}

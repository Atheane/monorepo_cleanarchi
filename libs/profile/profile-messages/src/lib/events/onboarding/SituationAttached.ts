import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { ProfileConsent } from '../profile/types/ProfileConsent';

export interface SituationAttachedProps {
  vip: boolean;
  staff: boolean;
  lead: boolean;
  consents: {
    partners: ProfileConsent;
    oney: ProfileConsent;
  };
}

@DecoratedEvent({ version: 1, name: 'SITUATION_ATTACHED', namespace: '@oney/profile' })
export class SituationAttached implements DomainEvent<SituationAttachedProps> {
  id: string = uuidv4();

  props: SituationAttachedProps;
  metadata?: DomainEventMetadata;
  constructor(props: SituationAttachedProps) {
    this.props = { ...props };
  }
}

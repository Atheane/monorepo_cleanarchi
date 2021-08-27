import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { ProfileStatus } from '../types/ProfileStatus';

export interface DiligenceSctInCompletedProps {
  status: ProfileStatus;
}

@DecoratedEvent({ version: 1, name: 'DILIGENCE_SCT_IN_COMPLETED', namespace: '@oney/profile' })
export class DiligenceSctInCompleted implements DomainEvent<DiligenceSctInCompletedProps> {
  id: string = uuidv4();

  props: DiligenceSctInCompletedProps;

  metadata?: DomainEventMetadata;

  constructor(props: DiligenceSctInCompletedProps) {
    this.props = { ...props };
  }
}

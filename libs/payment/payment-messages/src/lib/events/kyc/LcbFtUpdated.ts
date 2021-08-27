import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';

export enum LcbFtRiskLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export interface LcbFtUpdatedProps {
  type: string;
  eventDate: string;
  appUserId: string;
  riskLevel: LcbFtRiskLevel;
}

@DecoratedEvent({ version: 1, name: 'LCB_FT_UPDATED', namespace: '@oney/payment' })
export class LcbFtUpdated implements DomainEvent<LcbFtUpdatedProps> {
  id: string = uuidv4();

  props: LcbFtUpdatedProps;
  metadata?: DomainEventMetadata;
  constructor(props: LcbFtUpdatedProps) {
    this.props = { ...props };
  }
}

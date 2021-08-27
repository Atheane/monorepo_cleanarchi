import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { UncappingEventState } from '../../types/UncappingEventState';
import { UncappingEventReason } from '../../types/UncappingEventReason';

export interface UncappingStateChangedProps {
  uncappingState: UncappingEventState;
  reason: UncappingEventReason;
}

@DecoratedEvent({ version: 1, name: 'UNCAPPING_STATE_CHANGED', namespace: '@oney/payment' })
export class UncappingStateChanged implements DomainEvent<UncappingStateChangedProps> {
  id: string = uuidV4();
  props: UncappingStateChangedProps;
  metadata?: DomainEventMetadata;

  constructor(props: UncappingStateChangedProps, metadata?: DomainEventMetadata) {
    this.props = { ...props };
    this.metadata = { ...metadata };
  }
}

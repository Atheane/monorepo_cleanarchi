import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { SplitSimulatedProperties } from './types/SplitSimulatedProperties';

@DecoratedEvent({ version: 1, name: 'SPLIT_SIMULATED', namespace: '@oney/credit' })
export class SplitSimulated implements DomainEvent<SplitSimulatedProperties> {
  id: string = uuidv4();

  props: SplitSimulatedProperties;

  metadata?: DomainEventMetadata;

  constructor(props: SplitSimulatedProperties) {
    this.props = { ...props };
  }
}

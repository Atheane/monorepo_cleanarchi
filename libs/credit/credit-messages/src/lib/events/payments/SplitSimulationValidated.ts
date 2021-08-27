import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { SplitSimulationValidatedProperties } from './types/SplitSimulationValidatedProperties';

@DecoratedEvent({ version: 1, name: 'SIMULATION_SAVED', namespace: '@oney/credit' })
export class SplitSimulationValidated implements DomainEvent<SplitSimulationValidatedProperties> {
  id: string = uuidv4();

  props: SplitSimulationValidatedProperties;

  metadata?: DomainEventMetadata;

  constructor(props: SplitSimulationValidatedProperties) {
    this.props = { ...props };
  }
}

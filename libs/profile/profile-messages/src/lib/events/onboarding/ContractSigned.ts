import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';

export interface ContractSignedProps {
  date: Date;
}

@DecoratedEvent({ version: 1, name: 'CONTRACT_SIGNED', namespace: '@oney/profile' })
export class ContractSigned implements DomainEvent<ContractSignedProps> {
  id: string = uuidv4();

  props: ContractSignedProps;

  metadata: DomainEventMetadata;

  constructor(props: ContractSignedProps) {
    this.props = { ...props };
  }
}

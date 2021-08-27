import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';

export interface AddressStepValidatedProps {
  street: string;
  additionalStreet?: string;
  city: string;
  zipCode: string;
  country: string;
}

@DecoratedEvent({ version: 1, name: 'ADDRESS_STEP_VALIDATED', namespace: '@oney/profile' })
export class AddressStepValidated implements DomainEvent<AddressStepValidatedProps> {
  id: string = uuidv4();

  props: AddressStepValidatedProps;
  metadata?: DomainEventMetadata;
  constructor(props: AddressStepValidatedProps) {
    this.props = { ...props };
  }
}

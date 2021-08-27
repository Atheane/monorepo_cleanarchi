import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';

export interface PhoneStepValidatedProps {
  phone: string;
}

@DecoratedEvent({ version: 1, name: 'PHONE_STEP_VALIDATED', namespace: '@oney/profile' })
export class PhoneStepValidated implements DomainEvent<PhoneStepValidatedProps> {
  id: string = uuidv4();

  props: PhoneStepValidatedProps;

  metadata?: DomainEventMetadata;

  constructor(props: PhoneStepValidatedProps) {
    this.props = { ...props };
  }
}

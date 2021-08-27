import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { Events } from '../Events';

export interface BeneficiaryCreatedProps {
  id: string;

  bic: string;

  email: string;

  name: string;

  status: number;

  iban: string;
}

@DecoratedEvent({ version: 1, name: Events.BENEFICIARY_CREATED, namespace: '@oney/payment' })
export class BeneficiaryCreated implements DomainEvent<BeneficiaryCreatedProps> {
  id = uuidV4();

  props: BeneficiaryCreatedProps;

  metadata?: DomainEventMetadata;

  constructor(props: BeneficiaryCreatedProps) {
    this.props = { ...props };
  }
}

import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { InternalIncidentsType } from './types/InternalIncidentsType';

export type CreditAccountsSituationType = {
  totalOutstandingCredit: number;
};

export interface CustomerSituationsUpdatedProps {
  uuid: string;
  timestamp: Date;
  lead: boolean;
  internalIncidents: InternalIncidentsType;
  creditAccountsSituation: CreditAccountsSituationType;
}

@DecoratedEvent({ version: 1, name: 'CUSTOMER_SITUATIONS_UPDATED', namespace: '@oney/profile' })
export class CustomerSituationsUpdated implements DomainEvent<CustomerSituationsUpdatedProps> {
  id: string = uuidv4();

  props: CustomerSituationsUpdatedProps;

  metadata: DomainEventMetadata;

  constructor(props: CustomerSituationsUpdatedProps) {
    this.props = { ...props };
  }
}

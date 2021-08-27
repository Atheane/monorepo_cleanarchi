import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { Collection } from './types/Collection';
import { DebtEvents } from './types/DebtEvents';
import { DebtStatus } from './types/DebtStatus';

export interface DebtCreatedProps {
  id: string;
  userId: string;
  date: Date;
  debtAmount: number;
  remainingDebtAmount: number;
  status: DebtStatus;
  reason: string;
  collections: Collection[];
}

@DecoratedEvent({ version: 1, name: DebtEvents.DEBT_CREATED, namespace: '@oney/payment' })
export class DebtCreated implements DomainEvent<DebtCreatedProps> {
  id = uuidV4();

  props: DebtCreatedProps;
  metadata?: DomainEventMetadata;
  constructor(props: DebtCreatedProps) {
    this.props = { ...props };
  }
}

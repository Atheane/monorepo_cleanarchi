import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { Collection } from './types/Collection';
import { DebtEvents } from './types/DebtEvents';
import { DebtStatus } from './types/DebtStatus';

export interface DebtUpdatedProps {
  id: string;
  userId: string;
  date: Date;
  debtAmount: number;
  remainingDebtAmount: number;
  status: DebtStatus;
  reason: string;
  collections: Collection[];
}

@DecoratedEvent({ version: 1, name: DebtEvents.DEBT_UPDATED, namespace: '@oney/payment' })
export class DebtUpdated implements DomainEvent<DebtUpdatedProps> {
  id = uuidV4();

  props: DebtUpdatedProps;
  metadata?: DomainEventMetadata;
  constructor(props: DebtUpdatedProps) {
    this.props = { ...props };
  }
}

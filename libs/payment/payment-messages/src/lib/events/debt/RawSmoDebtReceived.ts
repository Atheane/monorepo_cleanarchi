import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 } from 'uuid';

export interface RawSmoDebtProps {
  id: string;
  userId: string;
  date: string;
  debtAmount: number;
  originAmount: number;
  status: number;
  debtReason: string;
}

@DecoratedEvent({ name: 'RAW_SMO_DEBT_RECEIVED', version: 1, namespace: '@oney/payment' })
export class RawSmoDebtReceived implements DomainEvent<RawSmoDebtProps> {
  id: string;

  props: RawSmoDebtProps;
  metadata?: DomainEventMetadata;
  constructor(props: RawSmoDebtProps) {
    this.id = v4();
    this.props = {
      ...props,
    };
  }
}

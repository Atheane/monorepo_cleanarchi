import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { Events } from '../Events';

export interface TechnicalLimitCalculatedProps {
  technicalLimit: number;
  insights: {
    previousTechnicalLimit: number;
    globalOutLimit?: number;
    contract?: {
      funding: number;
      fees: number;
      firstMountlyPayment: number;
    };
    monthly?: {
      totalAmount: number;
    };
  };
}

@DecoratedEvent({ version: 1, name: Events.TECHNICAL_LIMIT_CALCULATED, namespace: '@oney/payment' })
export class TechnicalLimitCalculated implements DomainEvent<TechnicalLimitCalculatedProps> {
  id = uuidV4();

  props: TechnicalLimitCalculatedProps;

  metadata?: DomainEventMetadata;

  constructor(props: TechnicalLimitCalculatedProps) {
    this.props = { ...props };
  }
}

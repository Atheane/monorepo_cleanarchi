import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { Events } from '../Events';

export interface ExposureUpdatedProps {
  amount: number;
  insights: {
    balance: number;
    splitPaymentEligibility: boolean;
  };
}

@DecoratedEvent({ version: 1, name: Events.EXPOSURE_UPDATED, namespace: '@oney/payment' })
export class ExposureUpdated implements DomainEvent<ExposureUpdatedProps> {
  id = uuidV4();

  props: ExposureUpdatedProps;

  metadata?: DomainEventMetadata;

  constructor(props: ExposureUpdatedProps) {
    this.props = { ...props };
  }
}

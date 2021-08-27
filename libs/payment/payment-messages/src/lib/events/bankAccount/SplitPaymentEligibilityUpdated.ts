import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidV4 } from 'uuid';
import { Events } from '../Events';

export interface SplitPaymentEligibilityUpdatedProps {
  eligibility: boolean;
}

@DecoratedEvent({ version: 1, name: Events.SPLIT_PAYMENT_ELIGIBILITY_UPDATED, namespace: '@oney/payment' })
export class SplitPaymentEligibilityUpdated implements DomainEvent<SplitPaymentEligibilityUpdatedProps> {
  id = uuidV4();

  props: SplitPaymentEligibilityUpdatedProps;

  constructor(props: SplitPaymentEligibilityUpdatedProps) {
    this.props = { ...props };
  }
}

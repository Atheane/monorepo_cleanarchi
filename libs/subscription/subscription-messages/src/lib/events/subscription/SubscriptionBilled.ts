import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';

export interface SubscriptionBilledProps {
  orderId: string;
  index: number;
  nextBillingDate: Date;
}

@DecoratedEvent({ name: 'SUBSCRIPTION_BILLED', version: 1, namespace: '@oney/subscription' })
export class SubscriptionBilled implements DomainEvent<SubscriptionBilledProps> {
  id = uuidv4();
  props: SubscriptionBilledProps;
  metadata: DomainEventMetadata;

  constructor(props: SubscriptionBilledProps) {
    this.props = props;
  }
}

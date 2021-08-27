import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { SubscriptionStatus } from '../../..';

export interface SubscriptionCancelledProps {
  subscriberId: string;
  offerId: string;
  status: SubscriptionStatus;
}

@DecoratedEvent({ name: 'SUBSCRIPTION_CANCELLED', version: 1, namespace: '@oney/subscription' })
export class SubscriptionCancelled implements DomainEvent<SubscriptionCancelledProps> {
  id = uuidv4();
  props: SubscriptionCancelledProps;
  metadata: DomainEventMetadata;
  createdAt = new Date();
  constructor(props: SubscriptionCancelledProps) {
    this.props = props;
  }
}

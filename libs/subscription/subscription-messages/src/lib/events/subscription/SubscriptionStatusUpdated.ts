import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';
import { SubscriptionStatus } from '../../..';

export interface SubscriptionStatusUpdatedProps {
  subscriberId: string;
  offerId: string;
  status: SubscriptionStatus;
}

@DecoratedEvent({ name: 'SUBSCRIPTION_STATUS_UPDATED', version: 1, namespace: '@oney/subscription' })
export class SubscriptionStatusUpdated implements DomainEvent<SubscriptionStatusUpdatedProps> {
  id = uuidv4();
  props: SubscriptionStatusUpdatedProps;
  metadata: DomainEventMetadata;
  createdAt = new Date();

  constructor(props: SubscriptionStatusUpdatedProps) {
    this.props = props;
  }
}

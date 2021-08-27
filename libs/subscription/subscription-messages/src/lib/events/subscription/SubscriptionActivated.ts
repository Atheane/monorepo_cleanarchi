import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';
import { SubscriptionStatus } from '../../..';

export interface SubscriptionActivatedProps {
  nextBillingDate: Date;
  status: SubscriptionStatus;
  subscriberId: string;
}

@DecoratedEvent({ name: 'SUBSCRIPTION_ACTIVATED', version: 1, namespace: '@oney/subscription' })
export class SubscriptionActivated implements DomainEvent<SubscriptionActivatedProps> {
  id = uuidv4();
  props: SubscriptionActivatedProps;
  metadata: DomainEventMetadata;
  createdAt = new Date();

  constructor(props: SubscriptionActivatedProps) {
    this.props = props;
  }
}

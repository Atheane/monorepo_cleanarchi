import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';
import { OfferType, SubscriptionStatus } from '../../..';

export interface SubscriptionCreatedProps {
  subscriptionId: string;
  subscriberId: string;
  offerId: string;
  status: SubscriptionStatus;
  offerType: OfferType;
}

@DecoratedEvent({ name: 'SUBSCRIPTION_CREATED', version: 1, namespace: '@oney/subscription' })
export class SubscriptionCreated implements DomainEvent<SubscriptionCreatedProps> {
  id = uuidv4();
  props: SubscriptionCreatedProps;
  metadata: DomainEventMetadata;

  constructor(props: SubscriptionCreatedProps) {
    this.props = props;
  }
}

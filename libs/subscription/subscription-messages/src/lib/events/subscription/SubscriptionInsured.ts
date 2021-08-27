import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';

export interface SubscriptionInsuredProps {
  insuranceMembershipId: string;
}

@DecoratedEvent({ name: 'SUBSCRIPTION_INSURED', version: 1, namespace: '@oney/subscription' })
export class SubscriptionInsured implements DomainEvent<SubscriptionInsuredProps> {
  id = uuidv4();
  props: SubscriptionInsuredProps;
  metadata: DomainEventMetadata;

  constructor(props: SubscriptionInsuredProps) {
    this.props = props;
  }
}

import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';

export interface SubscriptionNextBillingDateUpdatedProps {
  subscriberId: string;
  offerId: string;
  nextBillingDate: Date;
}

@DecoratedEvent({
  name: 'SUBSCRIPTION_NEXT_BILLING_DATE_UPDATED',
  version: 1,
  namespace: '@oney/subscription',
})
export class SubscriptionNextBillingDateUpdated
  implements DomainEvent<SubscriptionNextBillingDateUpdatedProps> {
  id = uuidv4();
  props: SubscriptionNextBillingDateUpdatedProps;
  metadata: DomainEventMetadata;

  constructor(props: SubscriptionNextBillingDateUpdatedProps) {
    this.props = props;
  }
}

import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { CustomerType } from '@oney/subscription-messages';
import { DecoratedEvent } from '@oney/messages-core';

export interface CustomerTypeUpdatedProps {
  customerType: CustomerType;
}

@DecoratedEvent({ name: 'CUSTOMER_TYPE_UPDATED', version: 1, namespace: '@oney/subscription' })
export class CustomerTypeUpdated implements DomainEvent<CustomerTypeUpdatedProps> {
  id = uuidv4();
  props: CustomerTypeUpdatedProps;
  metadata: DomainEventMetadata;

  constructor(props: CustomerTypeUpdatedProps) {
    this.props = props;
  }
}

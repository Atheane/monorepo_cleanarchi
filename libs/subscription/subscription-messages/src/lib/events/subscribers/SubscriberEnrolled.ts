import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';

export interface SubscriberCreatedProps {
  uid: string;
}

@DecoratedEvent({ name: 'SUBSCRIBER_ENROLLED', version: 1, namespace: '@oney/subscription' })
export class SubscriberEnrolled implements DomainEvent<SubscriberCreatedProps> {
  id = uuidv4();
  props: SubscriberCreatedProps;
  metadata: DomainEventMetadata;

  constructor(props: SubscriberCreatedProps) {
    this.props = props;
  }
}

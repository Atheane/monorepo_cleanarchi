import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';

export interface SubscriberActivatedProps {
  activatedAt: Date;
}

@DecoratedEvent({ name: 'SUBSCRIBER_ACTIVATED', version: 1, namespace: '@oney/subscription' })
export class SubscriberActivated implements DomainEvent<SubscriberActivatedProps> {
  id = uuidv4();
  props: SubscriberActivatedProps;
  metadata: DomainEventMetadata;

  constructor(props: SubscriberActivatedProps) {
    this.props = props;
  }
}

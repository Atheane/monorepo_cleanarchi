import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';

//fixme to transform into command whenever available
export interface AttachCardProps {
  cardId: string;
  subscriptionId: string;
}

@DecoratedEvent({ name: 'ATTACH_CARD', version: 1, namespace: '@oney/subscription' })
export class AttachCard implements DomainEvent<AttachCardProps> {
  id = uuidv4();
  props: AttachCardProps;
  metadata: DomainEventMetadata;

  constructor(props: AttachCardProps) {
    this.props = props;
  }
}

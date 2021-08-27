import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';
import { OfferType } from '../..';

export interface OrderCardProps {
  offerType: OfferType;
  subscriberId: string;
}

@DecoratedEvent({ version: 1, name: 'ORDER_CARD', namespace: '@oney/subscription' })
export class OrderCard implements DomainEvent<OrderCardProps> {
  metadata: DomainEventMetadata;
  props: OrderCardProps;
  id = v4();

  constructor(props: OrderCardProps) {
    this.props = props;
  }
}

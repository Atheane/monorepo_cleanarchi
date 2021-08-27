import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { COPReceivedProperties } from '../types/COPReceivedProperties';

@DecoratedEvent({ version: 1, name: 'COP_RECEIVED', namespace: '@oney/payment' })
export class COPReceived implements DomainEvent<COPReceivedProperties> {
  id: string = uuidv4();

  props: COPReceivedProperties;

  constructor(props: COPReceivedProperties) {
    this.props = { ...props };
  }
}

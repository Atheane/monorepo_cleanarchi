import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { SDDReceivedProperties } from '../types/SDDReceivedProperties';

@DecoratedEvent({ version: 1, name: 'SDD_RECEIVED', namespace: '@oney/payment' })
export class SDDReceived implements DomainEvent<SDDReceivedProperties> {
  id: string = uuidv4();

  props: SDDReceivedProperties;

  constructor(props: SDDReceivedProperties) {
    this.props = { ...props };
  }
}

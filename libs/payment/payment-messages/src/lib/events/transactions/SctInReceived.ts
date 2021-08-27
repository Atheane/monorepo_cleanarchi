import { Event, DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { SctInReceivedProperties } from '../../types/SctInReceivedProperties';
import { Events } from '../Events';

@DecoratedEvent({ name: Events.SCT_IN_RECEIVED, version: 1, namespace: '@oney/payment' })
export class SctInReceived implements Event<SctInReceivedProperties> {
  id = uuidv4();
  props: SctInReceivedProperties;

  constructor(properties: SctInReceivedProperties) {
    this.props = { ...properties };
  }
}

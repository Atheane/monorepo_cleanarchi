import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { Events } from './Events';
import { TransferOutExecutedProperties } from '../types/TransferOutExecutedProperties';

@DecoratedEvent({ name: Events.SCT_OUT_EXECUTED, version: 1, namespace: '@oney/notification' })
export class TransferOutExecuted implements DomainEvent<TransferOutExecutedProperties> {
  id = uuidv4();
  props: TransferOutExecutedProperties;
  metadata: DomainEventMetadata;

  constructor(properties: TransferOutExecutedProperties) {
    this.props = { ...properties };
  }
}

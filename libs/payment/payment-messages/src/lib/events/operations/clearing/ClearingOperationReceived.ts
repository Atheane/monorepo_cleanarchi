import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { ClearingOperationReceivedProperties } from '../types/ClearingOperationReceivedProperties';

@DecoratedEvent({ version: 1, name: 'CLEARING_OPERATION_RECEIVED', namespace: '@oney/payment' })
export class ClearingOperationReceived implements DomainEvent<ClearingOperationReceivedProperties> {
  id: string = uuidv4();

  props: ClearingOperationReceivedProperties;
  metadata?: DomainEventMetadata;

  constructor(props: ClearingOperationReceivedProperties) {
    this.props = { ...props };
  }
}

import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { ClearingBatchReceivedProperties } from '../types/ClearingBatchReceivedProperties';

@DecoratedEvent({ version: 1, name: 'CLEARING_BATCH_RECEIVED', namespace: '@oney/payment' })
export class ClearingBatchReceived implements DomainEvent<ClearingBatchReceivedProperties> {
  id: string = uuidv4();

  props: ClearingBatchReceivedProperties;

  constructor(props: ClearingBatchReceivedProperties) {
    this.props = { ...props };
  }
}

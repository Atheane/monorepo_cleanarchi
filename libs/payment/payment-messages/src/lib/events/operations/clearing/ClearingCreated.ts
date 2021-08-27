import { DomainEvent } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { OperationCreatedProperties } from '../types/OperationCreatedProperties';

@DecoratedEvent({ version: 1, name: 'CLEARING_CREATED', namespace: '@oney/payment' })
export class ClearingCreated implements DomainEvent<OperationCreatedProperties> {
  id: string = uuidv4();

  props: OperationCreatedProperties;

  constructor(props: OperationCreatedProperties) {
    this.props = { ...props };
  }
}

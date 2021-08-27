import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { WithdrawalCreatedProperties } from './types/WithdrawalCreatedProperties';

@DecoratedEvent({ version: 1, name: 'WITHDRAWAL_CREATED', namespace: '@oney/payment' })
export class WithdrawalCreated implements DomainEvent<WithdrawalCreatedProperties> {
  id: string = uuidv4();

  props: WithdrawalCreatedProperties;

  metadata?: DomainEventMetadata;

  constructor(props: WithdrawalCreatedProperties) {
    this.props = { ...props };
  }
}

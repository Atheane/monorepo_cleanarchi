import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { SplitContractClosedProperties } from './types/SplitContractClosedProperties';
import { CreditEvents } from '../../CreditEvents';

@DecoratedEvent({ version: 1, name: CreditEvents.PAYMENT_SPLIT_CONTRACT_CLOSED, namespace: '@oney/credit' })
export class SplitContractClosed implements DomainEvent<SplitContractClosedProperties> {
  id: string = uuidv4();

  props: SplitContractClosedProperties;

  metadata: DomainEventMetadata;

  constructor(props: SplitContractClosedProperties) {
    this.props = { ...props };
  }
}

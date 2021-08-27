import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DomainEvent } from '@oney/ddd';
import { SplitContractCreatedProperties } from './types/SplitContractCreatedProperties';

@DecoratedEvent({ version: 1, name: 'CONTRACT_CREATED', namespace: '@oney/credit' })
export class SplitContractCreated implements DomainEvent<SplitContractCreatedProperties> {
  id: string = uuidv4();

  props: SplitContractCreatedProperties;

  constructor(props: SplitContractCreatedProperties) {
    this.props = { ...props };
  }
}

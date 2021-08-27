import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DiligencesType } from './types/DiligencesType';
import { DiligenceStatus } from './types/DiligenceStatus';
import { CallbackType } from '../../types/CallbackType';

// Fix-it: Should be pass in anti-corruption layer and parsed.
export interface DiligenceSctInReceivedProps {
  type: CallbackType;
  status: DiligenceStatus;
  appUserId: string;
  diligenceType: DiligencesType;
  amount: number;
  transferDate: Date;
  transmitterFullname: string;
}

@DecoratedEvent({ version: 1, name: 'DILIGENCE_SCT_IN_RECEIVED', namespace: '@oney/payment' })
export class DiligenceSctInReceived implements DomainEvent<DiligenceSctInReceivedProps> {
  id: string = uuidv4();

  props: DiligenceSctInReceivedProps;
  metadata?: DomainEventMetadata;
  constructor(props: DiligenceSctInReceivedProps) {
    this.props = { ...props };
  }
}

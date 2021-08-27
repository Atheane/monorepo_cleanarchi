import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DiligencesType } from './types/DiligencesType';
import { DiligenceStatus } from './types/DiligenceStatus';
import { CallbackType } from '../../types/CallbackType';

export type Diligences = {
  reason?: string;
  type: DiligencesType;
  status: DiligenceStatus;
};

// Fix-it: Should be pass in anti-corruption layer and parsed.
export interface EkycUpdatedProps {
  id: string;
  type: CallbackType;
  userId: string;
  status: string;
  diligences: Diligences[];
}

@DecoratedEvent({ version: 1, name: 'EKYC_UPDATED', namespace: '@oney/payment' })
export class EkycUpdated implements DomainEvent<EkycUpdatedProps> {
  id: string = uuidv4();

  props: EkycUpdatedProps;
  metadata?: DomainEventMetadata;
  constructor(props: EkycUpdatedProps) {
    this.props = { ...props };
  }
}

import { DecoratedEvent, Event } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { KycDiligenceApiErrorReason } from './types/KycDiligenceApiErrorReason';

export interface KycDiligenceFailedProps {
  reason: KycDiligenceApiErrorReason;
  accountId: string;
  type: string;
}

@DecoratedEvent({ version: 1, name: 'KYC_DILIGENCE_FAILED', namespace: '@oney/payment' })
export class KycDiligenceFailed implements Event<KycDiligenceFailedProps> {
  id: string = uuidv4();

  props: KycDiligenceFailedProps;

  constructor(props: KycDiligenceFailedProps) {
    this.props = props;
  }
}

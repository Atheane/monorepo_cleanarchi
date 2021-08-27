import { DecoratedEvent, Event } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { DiligencesType } from './types/DiligencesType';

export interface KycDiligenceSucceededProps {
  diligenceType: DiligencesType;
}

@DecoratedEvent({ version: 2, name: 'KYC_DILIGENCE_SUCCEEDED', namespace: '@oney/payment' })
export class KycDiligenceSucceeded implements Event<KycDiligenceSucceededProps> {
  id: string = uuidv4();

  props: KycDiligenceSucceededProps;

  constructor(props: KycDiligenceSucceededProps) {
    this.props = props;
  }
}

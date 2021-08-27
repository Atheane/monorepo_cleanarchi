import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { KycDecisionType } from '@oney/profile-messages';
import { KycFraudType } from '../kyc/types/KycFraudType';

export interface OtScoringReceivedProps {
  uid: string;
  caseReference: string;
  caseId: number;
  decisionScore: number;
  decision: KycDecisionType;
  sanctioned: KycDecisionType;
  politicallyExposed: KycDecisionType;
  compliance: KycDecisionType;
  fraud: KycFraudType;
}

@DecoratedEvent({ version: 1, name: 'OT_SCORING_RECEIVED', namespace: '@oney/profile' })
export class OtScoringReceived implements DomainEvent<OtScoringReceivedProps> {
  id: string = uuidv4();

  props: OtScoringReceivedProps;

  metadata?: DomainEventMetadata;

  constructor(props: OtScoringReceivedProps) {
    this.props = { ...props };
  }
}

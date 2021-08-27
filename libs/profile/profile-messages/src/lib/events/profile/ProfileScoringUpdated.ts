import { DecoratedEvent } from '@oney/messages-core';
import { DomainEvent } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';
import { KycDecisionType } from '../kyc/types/KycDecisionType';
import { KycFraudType } from '../kyc/types/KycFraudType';

export interface Scoring {
  caseReference: string;
  caseId: number;
  decisionScore: number;
  decision: KycDecisionType;
  sanctioned: KycDecisionType;
  politicallyExposed: KycDecisionType;
  compliance: KycDecisionType;
  fraud: KycFraudType;
}

export interface ProfileScoringUpdatedProps {
  scoring: Scoring;
}

@DecoratedEvent({ version: 1, name: 'PROFILE_SCORING_UPDATED', namespace: '@oney/profile' })
export class ProfileScoringUpdated implements DomainEvent<ProfileScoringUpdatedProps> {
  id: string = uuidv4();

  props: ProfileScoringUpdatedProps;

  constructor(props: ProfileScoringUpdatedProps) {
    this.props = { ...props };
  }
}

import { KycDecisionType } from '@oney/profile-messages';
import { KycFraudType } from '@oney/profile-core';

export interface Scoring {
  decision: KycDecisionType;
  fraud: KycFraudType;
  compliance: KycDecisionType;
}

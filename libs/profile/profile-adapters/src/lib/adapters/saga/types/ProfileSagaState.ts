import { SagaState } from '@oney/saga-core';
import { ProfileStatus } from '@oney/profile-messages';
import { LcbFtRiskLevel } from '@oney/payment-messages';
import { Scoring } from './Scoring';
import { Eligibility } from './Eligibility';

export interface ProfileSagaState extends SagaState {
  uid: string;
  status: ProfileStatus;
  scoring: Scoring;
  eligibility: Eligibility;
  risk: LcbFtRiskLevel;
  amlReceived: boolean;
  eligibilityReceived: boolean;
  taxNoticeUploaded: boolean;
}

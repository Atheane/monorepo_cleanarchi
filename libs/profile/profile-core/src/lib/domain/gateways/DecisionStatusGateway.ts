import { ProfileStatus } from '@oney/profile-messages';
import { KYC } from '../valuesObjects/KYC';

export interface DecisionStatusGateway {
  getDecisionStatus(request: KYC): ProfileStatus;
}

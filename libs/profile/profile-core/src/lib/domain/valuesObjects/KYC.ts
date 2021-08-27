import { PublicProperties } from '@oney/common-core';
import { LcbFtRiskLevel } from '@oney/payment-messages';
import { Eligibility } from './Eligibility';
import { KycDecisionType } from '../types/KycDecisionType';
import { KycFraudType } from '../types/KycFraudType';
import { Steps } from '../types/Steps';

export class KYC {
  caseReference: string;
  caseId?: number;
  decisionScore?: number;
  decision?: KycDecisionType;
  sanctioned?: KycDecisionType;
  politicallyExposed?: KycDecisionType;
  compliance?: KycDecisionType;
  fraud?: KycFraudType;
  moneyLaunderingRisk?: LcbFtRiskLevel;
  url?: string;
  contractSignedAt?: Date;
  steps?: Steps[];
  idDocumentLocation?: string;
  creationDate?: Date;
  eligibility?: Eligibility;
  amlReceived: boolean;
  eligibilityReceived: boolean;
  existingIdentity?: boolean;
  taxNoticeUploaded?: boolean;
  versions?: KYC[];

  constructor(kyc: PublicProperties<KYC>) {
    Object.assign(this, kyc);
  }
}

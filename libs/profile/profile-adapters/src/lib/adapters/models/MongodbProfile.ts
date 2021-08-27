import {
  Consents,
  Eligibility,
  FiscalReference,
  HonorificCode,
  KycDecisionType,
  KycFraudType,
  ProfileDocumentProps,
  Situation,
  Steps,
} from '@oney/profile-core';
import { LcbFtRiskLevel } from '@oney/payment-messages';
import { ProfileStatus } from '@oney/profile-messages';

export interface Address {
  street: string;
  additional_street?: string;
  city: string;
  zip_code: string;
  country: string;
}

export interface legacyKYC {
  case_reference: string;
  url: string;
  contract_signed_at: Date;
  steps: Steps[];
  caseId?: number;
  decisionScore?: number;
  decision?: KycDecisionType;
  sanctioned?: KycDecisionType;
  politicallyExposed?: KycDecisionType;
  fraud?: KycFraudType;
  compliance?: KycDecisionType;
  moneyLaunderingRisk?: LcbFtRiskLevel;
  eligibility?: Eligibility;
  amlReceived: boolean;
  eligibilityReceived: boolean;
  existingIdentity?: boolean;
  taxNoticeUploaded?: boolean;
  versions?: legacyKYC[];
}

export interface UserProfile {
  status: ProfileStatus;
  honorific_code: HonorificCode;
  birth_name: string;
  legal_name: string;
  first_name: string;
  birth_date: Date;
  birth_city: string;
  birth_department_code: string;
  birth_district_code: string;
  birth_country: string;
  nationality_country_code: string;
  phone: string;
  economic_activity: number;
  earnings_amount: number;
  fiscal_country: string;
  address: Address;
  fiscal_reference: FiscalReference;
}

export interface MongodbProfile {
  uid: string;
  email: string;
  is_validated: boolean;
  user_profile: UserProfile;
  kyc: legacyKYC;
  can_bypass_oney_login: boolean;
  digital_identity: string;
  oney_author_token: string;
  biometric_key: string;
  documents: ProfileDocumentProps[];
  situation?: Situation;
  consents: Consents;
}

import {
  ProfileStatus,
  HonorificCode,
  OnboardingSteps,
  KycDecisionType,
  KycDecisionDocument,
} from '@oney/profile-messages';

export interface GetProfileInformationResponse {
  uid: string;
  email: string;
  biometric_key: string;
  is_validated: boolean;
  profile: {
    address: {
      street: string;
      country: string;
      city: string;
      zip_code: string;
    };
    phone: string;
    birth_city: string;
    birth_country: string;
    birth_department_code: string;
    birth_district_code: string;
    birth_date: Date;
    birth_name: string;
    first_name: string;
    honorific_code: HonorificCode;
    earnings_amount: number;
    fiscal_country: string;
    legal_name: string;
    status: ProfileStatus;
  };
  kyc: {
    decision: KycDecisionType;
    politicallyExposed: KycDecisionType;
    sanctioned: KycDecisionType;
  };
  documents: KycDecisionDocument[];
  steps: OnboardingSteps[];
  contract_signed_at: Date;
}

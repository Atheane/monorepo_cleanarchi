import { KycDecisionType } from '@oney/profile-messages';
import { Consents, HonorificCode, ProfileDocumentProps, Steps } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';

export type PublicProfile = {
  uid: string;
  email: string;
  biometric_key: string;
  is_validated: boolean;
  profile?: {
    address: {
      street: string;
      additional_street?: string;
      country: string;
      city: string;
      zip_code: string;
    };
    status: ProfileStatus;
    phone: string;
    birth_city: string;
    birth_department_code: string;
    birth_district_code: string;
    birth_country: string;
    birth_date: Date;
    birth_name: string;
    first_name: string;
    honorific_code: HonorificCode;
    earnings_amount: number;
    economic_activity: number;
    fiscal_country: string;
    legal_name: string;
    nationality: string;
  };
  kyc: {
    decision: KycDecisionType;
    politicallyExposed: KycDecisionType;
    sanctioned: KycDecisionType;
  };
  steps?: Steps[];
  contract_signed_at: Date;
  documents: ProfileDocumentProps[];
  consents: Consents;
  facematch_url: string;
};

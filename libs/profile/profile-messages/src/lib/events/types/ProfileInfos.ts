import { ProfileStatus } from './ProfileStatus';
import { HonorificCode } from './HonorificCode';
import { FiscalReference } from '../onboarding/types/FiscalReference';
import { KycDecisionType } from '../kyc/types/KycDecisionType';
import { KycDecisionDocument } from '../kyc/UserKycDecisionUpdated';

export interface ProfileInfos {
  informations: {
    phone: string;
    legalName: string;
    firstName: string;
    honorificCode: HonorificCode;
    birthDate: Date;
    birthCountry: string;
    birthCity: string;
    birthDepartmentCode: string;
    birthDistrictCode: string;
    address: {
      street: string;
      additionalStreet?: string;
      city: string;
      zipCode: string;
      country: string;
    };
    nationalityCountryCode: string;
    birthName: string;
    earningsAmount: number;
    fiscalCountry: string;
    economicActivity: string;
    status: ProfileStatus;
    fiscalReference: FiscalReference;
  };
  kyc: {
    decision: KycDecisionType;
    politicallyExposed: KycDecisionType;
    sanctioned: KycDecisionType;
    documents: KycDecisionDocument[];
  };
  email: string;
  uid: string;
  enabled: boolean;
}

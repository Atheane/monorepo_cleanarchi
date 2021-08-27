export enum OneyTrustGender {
  MALE = 'M',
  FEMALE = 'F',
  OTHER = 'X',
}

export interface Address {
  streetName1?: string;
  streetName2?: string;
  postCode?: string;
  locality?: string;
  country?: string;
}

export interface Income {
  earningsAmountRange?: number;
  fiscalCountry?: string;
}

export interface UpdateOneyTrustCaseRequest {
  caseReference: string;
  familyName: string;
  birthName: string;
  givenNames: string;
  birthDate: string;
  nativeCity: string;
  nativeCountry: string;
  nationality: string;
  ipAddress: string;
  address?: Address;
  gender: OneyTrustGender;
  currency?: string;
  income?: Income;
  professionalSituation?: {
    professionalCategory: string;
    profession?: string;
  };
  email?: string;
  phone?: string;
}

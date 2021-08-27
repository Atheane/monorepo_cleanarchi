export enum SmoneyUserType {
  NOT_APPLICABLE,
  INDIVIDUAL_CLIENT,
  PROFESSIONAL_CLIENT,
}

export enum SmoneyUserCivility {
  MISTER,
  MRS_MISS,
}

export enum SmoneyUserRole {
  CLIENT_DECLARATIVE = 1,
  EXTENDED_CLIENT_KYC_2_IDENTITY,
  EXTENDED_CLIENT_KYC_3_PROOF_OF_RESIDENCY,
  EXTENDED_CLIENT_KYC_4_PROOF_OF_INCOME,
}

export interface SmoneyUserBankAccountRef {
  Id: number;
  Href: string;
}

export interface SmoneyUserSubAccount {
  Id: number;
  AppAccountId: string;
  Amount: number;
  AccountingBalanceAmount: number;
  DisplayName: string;
  CreationDate: Date;
  IsDefault: boolean;
  Iban: string;
  IbanHint: string;
}

export interface SmoneyUserCbCardRef {
  Id: number;
  AppCardId: string;
  Href: string;
}

export interface SmoneyUserResponse {
  Id: number;
  AppUserId: string;
  Type: SmoneyUserType;
  Role: SmoneyUserRole;
  Profile: {
    Civility: SmoneyUserCivility;
    FirstName: string;
    LastName: string;
    Birthdate: Date;
    Birthcity: string;
    BirthCountry: string;
    BirthZipCode?: string;
    Address: {
      Street: string;
      ZipCode: string;
      City: string;
      Country: string;
    };
    PhoneNumber: string;
    Email: string;
    Alias: string;
    Picture: {
      Href: string;
    };
    EconomicActivity: number;
    Asset: unknown;
    Income: unknown;
  };
  Credentials: unknown;
  Amount: number;
  AccountingBalanceAmount: number;
  SubAccounts: SmoneyUserSubAccount[];
  BankAccounts: SmoneyUserBankAccountRef[];
  CBCards: SmoneyUserCbCardRef[];
  Status: 1;
  Company: null;
  CountryCode: null;
  KycStatus: 3;
  OnBoardingDate: Date;
}

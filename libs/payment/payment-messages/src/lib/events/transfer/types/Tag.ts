import { BankAccountType } from './BankAccountType';

export interface Tag {
  outstandingCode: string;

  operationCodeType: string;

  productCode: string;

  countryCode: string;

  ref: number;

  senderType: BankAccountType;

  beneficiaryType: BankAccountType;

  generateUnpaid: boolean;

  verifyLimits: boolean;

  contractNumber?: string;

  subscriptionMonthlyNumber?: string;

  generatedTag?: string;
}

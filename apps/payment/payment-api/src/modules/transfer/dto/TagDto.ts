import { BankAccountType } from '@oney/payment-core';

export interface TagDto {
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

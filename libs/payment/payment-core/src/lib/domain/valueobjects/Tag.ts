import { PublicProperties } from '@oney/common-core';
import { BankAccountType } from '../types/BankAccountType';

export class Tag {
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

  constructor(tag: PublicProperties<Tag>) {
    Object.assign(this, { ...tag });
    this.generatedTag = this.buildTag();
  }

  buildTag(): string {
    // eslint-disable-next-line max-len
    return `${this.setWhiteSpace(this.outstandingCode, 1)}-${this.setWhiteSpace(
      this.operationCodeType,
      18,
    )}-${this.setWhiteSpace(this.productCode, 5)}-${this.setWhiteSpace(
      this.countryCode,
      3,
    )}-${this.setWhiteSpace(this.subscriptionMonthlyNumber, 3)}-${this.contractNumber || ' '}`;
  }

  setWhiteSpace(tagType: string, whiteSpaces: number): string {
    const whiteSpaceToAdd = whiteSpaces - tagType.length;
    return tagType + new Array(whiteSpaceToAdd + 1).join(' ');
  }

  isBeneficiaryTypeAndSenderTypeAUserAccount(): boolean {
    return (
      this.beneficiaryType === BankAccountType.USER_ACCOUNT &&
      this.senderType === BankAccountType.USER_ACCOUNT
    );
  }
}

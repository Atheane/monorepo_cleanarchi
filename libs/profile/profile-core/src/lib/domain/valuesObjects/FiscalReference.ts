import { PublicProperties } from '@oney/common-core';

export class FiscalReference {
  country: string;
  fiscalNumber?: string;
  globalGrossIncome?: string;
  personalSituationCode?: string;
  establishmentDate?: Date;

  constructor(fiscalReference: PublicProperties<FiscalReference>) {
    Object.assign(this, fiscalReference);
  }
}

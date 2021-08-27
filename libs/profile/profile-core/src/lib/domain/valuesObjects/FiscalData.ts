import { PublicProperties } from '@oney/common-core';

export class FiscalData {
  globalGrossIncome?: string;
  personalSituationCode?: string;
  establishmentDate?: Date;

  constructor(fiscalData: PublicProperties<FiscalData>) {
    Object.assign(this, fiscalData);
  }
}

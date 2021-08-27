import { BeneficiaryProperties } from '@oney/payment-core';

export interface BeneficiaryDTO extends BeneficiaryProperties {
  id: string;
  bic: string;
  email: string;
  name: string;
  status: number;
  iban: string;
}

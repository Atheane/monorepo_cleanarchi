import {
  Debt,
  MonthlyAllowance,
  DiligenceStatus,
  LimitInformationProperties,
  ProductsEligibility,
  UncappingState,
  DiligencesType,
} from '@oney/payment-core';
import { LegacyCard } from './LegacyCard';
import { LegacyBankAccountBeneficiary } from './LegacyBankAccountBeneficiary';

export class LegacyBankAccount {
  uid: string;
  bid: string;
  iban: string;
  bic: string;
  cards: LegacyCard[];
  beneficiaries: LegacyBankAccountBeneficiary[];
  monthlyAllowance: MonthlyAllowance;
  kycDiligenceStatus?: DiligenceStatus;
  kycDiligenceValidationMethod?: DiligencesType;
  debts?: Debt[];
  limits?: LimitInformationProperties;
  uncappingState: UncappingState;
  productsEligibility: ProductsEligibility;

  constructor(props: LegacyBankAccount) {
    Object.assign(this, props);
  }
}

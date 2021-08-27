import { LegacyBankAccountBeneficiary } from './LegacyBankAccountBeneficiary';
import { LegacyCard } from './LegacyCard';
import { MonthlyAllowance } from '../../types/MonthlyAllowance';
import { ProductsEligibility } from '../../valueobjects/bankAccount/ProductsEligibility';
import { UncappingState } from '../../valueobjects/bankAccount/UncappingState';

export interface LegacyBankAccount {
  uid: string;
  bid: string;
  iban: string;
  bic: string;
  cards: LegacyCard[];
  beneficiaries: LegacyBankAccountBeneficiary[];
  monthlyAllowance: MonthlyAllowance;
  uncappingState: UncappingState;
  productsEligibility: ProductsEligibility;
}

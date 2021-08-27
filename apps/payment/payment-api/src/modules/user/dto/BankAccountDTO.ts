import {
  BankAccountProperties,
  DiligenceStatus,
  DiligencesType,
  LimitInformationProperties,
  MonthlyAllowance,
  ProductsEligibility,
  UncappingState,
} from '@oney/payment-core';
import { BeneficiaryDTO } from './BeneficiaryDTO';
import { CardDTO } from './CardDTO';
import { DebtDTO } from './DebtDTO';

export interface BankAccountDTO
  extends Omit<BankAccountProperties, 'cards' | 'debts' | 'beneficiaries' | 'limits'> {
  uid: string;
  iban: string;
  bic: string;
  bankAccountId: string;
  beneficiaries?: BeneficiaryDTO[];
  cards?: CardDTO[];
  debts?: DebtDTO[];
  monthlyAllowance?: MonthlyAllowance;
  kycDiligenceStatus?: DiligenceStatus;
  kycDiligenceValidationMethod?: DiligencesType;
  uncappingState: UncappingState;
  isUncapped: boolean;
  productsEligibility: ProductsEligibility;
  limits?: LimitInformationProperties;
}

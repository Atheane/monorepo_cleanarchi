import {
  Debt,
  MonthlyAllowance,
  DiligenceStatus,
  LimitInformationProperties,
  ProductsEligibility,
  UncappingState,
  DiligencesType,
} from '@oney/payment-core';

interface CardDbModel {
  cid: string;
  pan: string;
  status: number;
  cardType: number;
  hasPin: boolean;
  uniqueId: string;
  blocked: boolean;
  foreignPayment: boolean;
  internetPayment: boolean;
  atmWeeklyAllowance: number;
  atmWeeklyUsedAllowance: number;
  monthlyAllowance: number;
  monthlyUsedAllowance: number;
}

interface BeneficiaryDbModel {
  bic: string;
  bid: string;
  email: string;
  name: string;
  status: number;
  iban?: string;
}

export interface AccountDbModel {
  uid: string;
  bid: string;
  iban: string;
  bic: string;
  cards: CardDbModel[];
  beneficiaries: BeneficiaryDbModel[];
  monthlyAllowance: MonthlyAllowance;
  kycDiligenceStatus?: DiligenceStatus;
  kycDiligenceValidationMethod?: DiligencesType;
  debts?: Debt[];
  uncappingState: UncappingState;
  productsEligibility: ProductsEligibility;
  limits?: LimitInformationProperties;
}

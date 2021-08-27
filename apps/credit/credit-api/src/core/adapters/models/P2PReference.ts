import { BankAccountType, ScheduleKey, SplitProduct } from '@oney/credit-messages';

export type TagMapProperties = {
  ref: number;
  outstandingCode: string;
  operationCodeType: string;
  productCode: string;
  countryCode: string;
  subscriptionMontlyNumber: Omit<ScheduleKey, 'fee' | 'funding'>;
  senderType: BankAccountType;
  beneficiaryType: BankAccountType;
  checkLimits: boolean;
  checkUnPaid: boolean;
  generateUnpaid?: boolean;
  verifyLimits?: boolean;
  generatedTag?: string;
  key?: string;
};

export type P2PReference = {
  ref: number;
  operationCodeType: string;
  key: string;
  label: string;
};

export const P2PReferences: P2PReference[] = [
  {
    ref: 1,
    operationCodeType: 'ECHEANCE3X',
    key: `${SplitProduct.DF003} ${ScheduleKey.M1}`,
    label: 'Échéance 1 fractionnement en 3x',
  },
  {
    ref: 2,
    operationCodeType: 'ECHEANCE4X',
    key: `${SplitProduct.DF004} ${ScheduleKey.M1}`,
    label: 'Échéance 1 fractionnement en 4x',
  },
  {
    ref: 7,
    operationCodeType: 'FINANCEMENT3X',
    key: `${SplitProduct.DF003} ${ScheduleKey.FUNDING}`,
    label: 'Financement 3x',
  },
  {
    ref: 8,
    operationCodeType: 'FINANCEMENT4X',
    key: `${SplitProduct.DF004} ${ScheduleKey.FUNDING}`,
    label: 'Financement 4x',
  },
  {
    ref: 37,
    operationCodeType: 'FRAIS FRACTIONMT3X',
    key: `${SplitProduct.DF003} ${ScheduleKey.FEE}`,
    label: 'Frais de fractionnement 3x',
  },
  {
    ref: 38,
    operationCodeType: 'FRAIS FRACTIONMT4X',
    key: `${SplitProduct.DF004} ${ScheduleKey.FEE}`,
    label: 'Frais de fractionnement 4x',
  },
];

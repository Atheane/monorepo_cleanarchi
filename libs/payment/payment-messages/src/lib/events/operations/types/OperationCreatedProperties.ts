export type OperationCreatedCounterparty = {
  bid: string;
  iban: string;
  name: string;
};

export enum OperationCreatedDirection {
  IN = 'in',
  OUT = 'out',
}

export class OperationCreatedVersion {
  localAmount: number;
  amount: number;
  autoBalance?: number;
  availableBalance: number;
  issuer?: OperationCreatedCounterparty;
  beneficiary?: OperationCreatedCounterparty;
  fee?: number;
  cardType: number;
  clearingDate: Date;
  conversionRate?: number;
  conversionRateCleared?: number;
  currency: string;
  date: Date;
  direction: OperationCreatedDirection;
  mcc: number;
  merchantAddress: string;
  merchantName: string;
  reason?: string;
  rejection_reason?: string;
  status: number;
  type: number;
  note?: string;
  category?: string;
  nxData?: string;
  linkedTransactions: string[];
}

export type OperationCreatedProperties = {
  orderId: string;
  uid: string;
  cardId?: string;
  version: OperationCreatedVersion[];
};

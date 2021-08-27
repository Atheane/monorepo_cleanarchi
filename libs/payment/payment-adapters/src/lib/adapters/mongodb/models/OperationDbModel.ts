export type OperationVersionCounterpartyDbModel = {
  bid: string;
  iban: string;
  name: string;
};

export type OperationVersionDbModel = {
  localAmount: number;
  amount: number;
  autoBalance?: number;
  availableBalance: number;
  issuer?: OperationVersionCounterpartyDbModel;
  beneficiary?: OperationVersionCounterpartyDbModel;
  fee?: number;
  cardType: number;
  clearingDate: Date;
  conversionRate?: number;
  conversionRateCleared?: number;
  currency: string;
  date: Date;
  direction: string;
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
};

export type OperationDbModel = {
  orderId: string;
  uid: string;
  cardId?: string;
  version: OperationVersionDbModel[];
};

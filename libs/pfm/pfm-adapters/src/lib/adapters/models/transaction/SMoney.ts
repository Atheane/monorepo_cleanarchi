export type SMoneyTransaction = {
  orderId: string;
  tid: string;
  uid: string;
  cardId: string;
  localAmount?: number;
  amount: number;
  beneficiary?: {
    bid: string;
    iban: string;
    name: string;
  };
  issuer: {
    uid: string;
    iban: string;
    name: string;
  };
  mcc?: number;
  currency: string;
  date: string;
  clearingDate?: string;
  direction: string;
  reason: string;
  status: string;
  type: string;
  linkedTransactions: LinkedTransactions[];
  rejection_reason: string;
  is_deposit: boolean;
  merchantName?: string;
  merchantAddress?: string;
  conversionRate?: number;
};

type LinkedTransactions = {
  tid: string;
  amount: string;
  date: string;
  name: string;
};

export enum SMoneyTransactionType {
  SCT = 'SCT',
  SDD = 'SDD',
  ATM = 'ATM',
  COP = 'COP',
}

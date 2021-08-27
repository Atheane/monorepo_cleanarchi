export class WithdrawalCreatedVersion {
  localAmount: number;
  amount: number;
  autoBalance?: number;
  availableBalance: number;
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
}

export type WithdrawalCreatedProperties = {
  orderId: string;
  uid: string;
  cardId?: string;
  version: WithdrawalCreatedVersion[];
};

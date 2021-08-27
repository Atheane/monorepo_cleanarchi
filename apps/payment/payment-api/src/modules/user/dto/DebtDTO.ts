import { DebtProperties, DebtStatus } from '@oney/payment-core';

export interface DebtDTO extends DebtProperties {
  id: string;
  userId: string;
  date: Date;
  debtAmount: number;
  remainingDebtAmount: number;
  status: DebtStatus;
  reason: string;
}

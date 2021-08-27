import { OperationType } from '@oney/payment-core';
import { OperationDirection } from '../../types/OperationDirection';
import { OperationCounterparty } from '../../types/operation/OperationCounterparty';

export class OperationVersion {
  localAmount: number;
  amount: number;
  autoBalance?: number;
  availableBalance: number;
  issuer?: OperationCounterparty;
  beneficiary?: OperationCounterparty;
  fee?: number;
  cardType: number;
  clearingDate: Date;
  conversionRate?: number;
  conversionRateCleared?: number;
  currency: string;
  date: Date;
  direction: OperationDirection;
  mcc: number;
  merchantAddress: string;
  merchantName: string;
  reason?: string;
  rejection_reason?: string;
  status: number;
  type: OperationType;
  note?: string;
  category?: string;
  nxData?: string;
  linkedTransactions: string[];
  refundReference?: string;
  initialOperation?: string;
}

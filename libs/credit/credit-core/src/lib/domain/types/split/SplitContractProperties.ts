import { ContractStatus, InitialPaymentSchedule, SplitProduct } from '@oney/credit-messages';
import { SplitPaymentSchedule } from '../../entities/SplitPaymentSchedule';

export type SplitContractProperties = {
  contractNumber: string;
  userId: string;
  initialTransactionId: string;
  transactionDate: Date;
  apr: number;
  productCode: SplitProduct;
  subscriptionDate: Date;
  status: ContractStatus;
  bankAccountId: string;
  initialPaymentSchedule: InitialPaymentSchedule;
  label: string;
  termsVersion: string;
  finalPaymentSchedule?: SplitPaymentSchedule;
};

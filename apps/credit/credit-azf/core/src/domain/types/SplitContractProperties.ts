import { InitialPaymentSchedule } from '@oney/credit-messages';
import { ContractStatus, SplitProduct } from '.';
import { SplitPaymentSchedule } from '../entities/SplitPaymentSchedule';

export type SplitContractProperties = {
  contractNumber: string;
  bankAccountId: string;
  userId: string;
  initialTransactionId: string;
  apr: number;
  productCode: SplitProduct;
  subscriptionDate: Date;
  status: ContractStatus;
  initialPaymentSchedule: InitialPaymentSchedule;
  finalPaymentSchedule?: SplitPaymentSchedule;
};

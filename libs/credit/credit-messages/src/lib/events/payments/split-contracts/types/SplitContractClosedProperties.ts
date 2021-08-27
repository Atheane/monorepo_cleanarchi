import { PaymentExecution } from '@oney/credit-messages';
import { ContractStatus } from '../../../../types/ContractStatus';
import { InitialPaymentSchedule } from '../../../../types/InitialPaymentSchedule';
import { SplitProduct } from '../../../../types/SplitProduct';

export type SplitContractClosedProperties = {
  contractNumber: string;
  bankAccountId: string;
  userId: string;
  initialTransactionId: string;
  apr: number;
  productCode: SplitProduct;
  subscriptionDate: Date;
  status: ContractStatus;
  initialPaymentSchedule: InitialPaymentSchedule;
  finalPaymentSchedule?: SplitContractClosedFinalPaymentSchedule;
};

export type SplitContractClosedFinalPaymentSchedule = {
  id: string;
  contractNumber: string;
  bankAccountId: string;
  userId: string;
  productCode: SplitProduct;
  status: ContractStatus;
  fundingExecution: PaymentExecution;
  paymentsExecution: PaymentExecution[];
};

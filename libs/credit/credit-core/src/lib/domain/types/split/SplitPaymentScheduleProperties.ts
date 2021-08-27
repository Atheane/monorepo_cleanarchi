import { ContractStatus, PaymentExecution, SplitProduct } from '@oney/credit-messages';

export type SplitPaymentScheduleProperties = {
  id: string;
  userId: string;
  contractNumber: string;
  bankAccountId: string;
  productCode: SplitProduct;
  status: ContractStatus;
  apr: number;
  label: string;
  fundingExecution?: PaymentExecution;
  paymentsExecution?: PaymentExecution[];
  initialTransactionId?: string;
};

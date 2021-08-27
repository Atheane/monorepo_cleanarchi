import { ContractStatus, PaymentExecution, SplitProduct } from '@oney/credit-messages';

export type SplitCreditDetails = {
  userId: string;
  productCode: SplitProduct;
  initialTransactionId: string;
  transactionDate: Date;
  subscriptionDate: Date;
  status: ContractStatus;
  contractNumber: string;
  apr: number;
  termsVersion: string;
  paymentScheduleExecution: PaymentExecution[];
};

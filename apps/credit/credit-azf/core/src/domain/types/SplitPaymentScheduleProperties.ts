import { SplitProduct, ContractStatus } from '.';
import { PaymentExecution } from './PaymentExecution';

export type SplitPaymentScheduleProperties = {
  id: string;
  contractNumber: string;
  bankAccountId: string;
  userId: string;
  productCode: SplitProduct;
  status: ContractStatus;
  fundingExecution: PaymentExecution;
  paymentsExecution: PaymentExecution[];
  initialTransactionId?: string;
};

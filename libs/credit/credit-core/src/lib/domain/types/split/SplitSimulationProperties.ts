import { PaymentDue, SplitProduct } from '@oney/credit-messages';

export interface SplitSimulationProperties {
  id: string;
  initialTransactionId: string;
  transactionDate: Date;
  label: string;
  userId: string;
  productCode: SplitProduct;
  fundingAmount: number;
  fee: number;
  apr: number;
  immediatePayments: PaymentDue[];
  deferredPayments: PaymentDue[];
}

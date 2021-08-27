import { PaymentDue } from '../../../types/PaymentDue';
import { SplitProduct } from '../../../types/SplitProduct';

export interface SplitSimulatedProperties {
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

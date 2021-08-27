import { PaymentDue } from '../../../types/PaymentDue';
import { SplitProduct } from '../../../types/SplitProduct';

export interface SplitSimulationValidatedProperties {
  id: string;
  initialTransactionId: string;
  label: string;
  userId: string;
  productCode: SplitProduct;
  fundingAmount: number;
  fee: number;
  apr: number;
  immediatePayments: PaymentDue[];
  deferredPayments: PaymentDue[];
}

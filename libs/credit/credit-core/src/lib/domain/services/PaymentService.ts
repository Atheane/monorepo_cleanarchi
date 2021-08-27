import { PaymentExecution, SplitProduct } from '@oney/credit-messages';

export interface PaymentService {
  executePayment(
    paymentExecution: PaymentExecution,
    userId: string,
    contractNumber: string,
    productCode: SplitProduct,
    label?: string,
  ): Promise<PaymentExecution | void>;
}

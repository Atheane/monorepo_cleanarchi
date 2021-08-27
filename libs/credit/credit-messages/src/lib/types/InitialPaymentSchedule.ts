import { PaymentDue } from './PaymentDue';

export type InitialPaymentSchedule = {
  immediatePayments: PaymentDue[];
  deferredPayments: PaymentDue[];
};

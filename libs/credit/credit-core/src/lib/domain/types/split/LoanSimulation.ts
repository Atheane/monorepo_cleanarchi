import { PaymentDue } from '@oney/credit-messages';

export type LoanSimulation = {
  fundingAmount: number;
  fee: number;
  apr: number;
  immediatePayments: PaymentDue[];
  deferredPayments: PaymentDue[];
};

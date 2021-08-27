import { PaymentStatus } from './PaymentStatus';

export type PaymentExecution = {
  key: string;
  amount: number;
  dueDate: Date;
  status: PaymentStatus;
  paymentDate?: Date; // when payment really takes place
  transactionId?: string; // corresponds to orderId from odb_payment
};

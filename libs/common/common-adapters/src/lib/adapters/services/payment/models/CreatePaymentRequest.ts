import { Recurrency } from '@oney/payment-messages';

export interface CreatePaymentRequest {
  ref: number;
  amount: number;
  contractNumber?: string;
  message: string;
  senderId: string;
  recurency: Recurrency;
  beneficiaryId?: string;
  orderId?: string;
}

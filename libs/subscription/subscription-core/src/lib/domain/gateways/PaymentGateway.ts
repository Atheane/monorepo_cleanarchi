import { Bill } from '@oney/subscription-core';

export interface PaymentGateway {
  pay(bill: Bill): Promise<void>;
}

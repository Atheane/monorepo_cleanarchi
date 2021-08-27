import { PaymentExecution } from '@oney/credit-messages';
import { injectable } from 'inversify';
import { Mapper } from '@oney/credit-core';
import { OdbPaymentResponse } from '../models';

@injectable()
export class PaymentExecutionMapper implements Mapper<PaymentExecution> {
  toDomain(raw: { result: OdbPaymentResponse; paymentExecution: PaymentExecution }): PaymentExecution {
    return {
      ...raw.paymentExecution,
      paymentDate: new Date(raw.result.executionDate),
      transactionId: raw.result.orderId,
    };
  }
}

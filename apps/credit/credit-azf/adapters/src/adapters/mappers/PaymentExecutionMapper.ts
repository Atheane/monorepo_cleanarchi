import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { PaymentExecution, PaymentStatus } from '../../../../core/src/domain/types';
import { OdbPaymentResponse } from '../models';

@injectable()
export class PaymentExecutionMapper implements Mapper<PaymentExecution> {
  toDomain(raw: { result: OdbPaymentResponse; paymentExecution: PaymentExecution }): PaymentExecution {
    return {
      ...raw.paymentExecution,
      paymentDate: new Date(raw.result.executionDate),
      status: PaymentStatus.PAID,
      transactionId: raw.result.orderId,
    };
  }
}

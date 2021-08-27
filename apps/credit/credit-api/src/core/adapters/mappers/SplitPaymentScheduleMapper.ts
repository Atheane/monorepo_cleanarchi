import { injectable } from 'inversify';
import { Mapper, SplitPaymentSchedule, SplitPaymentScheduleProperties } from '@oney/credit-core';

@injectable()
export class SplitPaymentScheduleMapper implements Mapper<SplitPaymentScheduleProperties> {
  toDomain(raw: any): SplitPaymentScheduleProperties {
    const splitPaymentSchedule: SplitPaymentScheduleProperties = {
      id: raw.id,
      contractNumber: raw.contractNumber,
      bankAccountId: raw.contractNumber,
      status: raw.status,
      fundingExecution: raw.fundingExecution,
      paymentsExecution: raw.paymentsExecution,
      userId: raw.userId,
      productCode: raw.productCode,
      apr: raw.apr,
      label: raw.label,
    };

    if (raw.initialTransactionId) {
      splitPaymentSchedule.initialTransactionId = raw.initialTransactionId;
    }

    return new SplitPaymentSchedule(splitPaymentSchedule).getProps;
  }
}

import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { SplitPaymentScheduleProperties } from '../../../../core/src/domain/types/SplitPaymentScheduleProperties';
import { SplitPaymentSchedule } from '../../../../core/src/domain';

@injectable()
export class SplitPaymentScheduleMapper implements Mapper<SplitPaymentSchedule> {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toDomain(raw: any): SplitPaymentSchedule {
    const splitPaymentSchedule: SplitPaymentScheduleProperties = {
      id: raw.id,
      userId: raw.userId,
      productCode: raw.productCode,
      bankAccountId: raw.bankAccountId,
      contractNumber: raw.contractNumber,
      status: raw.status,
      fundingExecution: raw.fundingExecution,
      paymentsExecution: raw.paymentsExecution,
    };
    if (raw.initialTransactionId) {
      splitPaymentSchedule.initialTransactionId = raw.initialTransactionId;
    }
    return new SplitPaymentSchedule(splitPaymentSchedule);
  }
}

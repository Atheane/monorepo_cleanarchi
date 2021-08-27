import { injectable } from 'inversify';
import { Mapper, SplitContract, SplitContractProperties, SplitPaymentSchedule } from '@oney/credit-core';

@injectable()
export class SplitContractMapper implements Mapper<SplitContractProperties> {
  toDomain(raw: any): SplitContractProperties {
    return new SplitContract({
      contractNumber: raw.contractNumber,
      userId: raw.userId,
      initialTransactionId: raw.initialTransactionId,
      transactionDate: raw.transactionDate,
      apr: raw.apr,
      productCode: raw.productCode,
      subscriptionDate: raw.subscriptionDate,
      status: raw.status,
      initialPaymentSchedule: raw.initialPaymentSchedule,
      bankAccountId: raw.bankAccountId,
      label: raw.label,
      termsVersion: raw.termsVersion,
      finalPaymentSchedule: new SplitPaymentSchedule({
        contractNumber: raw.contractNumber,
        ...raw.finalPaymentSchedule,
      }),
    }).props;
  }
}

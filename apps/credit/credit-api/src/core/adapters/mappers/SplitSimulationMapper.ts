import { injectable } from 'inversify';
import { SplitSimulation, Mapper, SplitSimulationProperties } from '@oney/credit-core';

@injectable()
export class SplitSimulationMapper implements Mapper<SplitSimulationProperties> {
  toDomain(raw: any): SplitSimulationProperties {
    return new SplitSimulation({
      id: raw.id,
      initialTransactionId: raw.initialTransactionId,
      transactionDate: raw.transactionDate,
      userId: raw.userId,
      productCode: raw.productCode,
      fundingAmount: raw.fundingAmount,
      fee: raw.fee,
      apr: raw.apr,
      immediatePayments: raw.immediatePayments,
      deferredPayments: raw.deferredPayments,
      label: raw.label,
    }).props;
  }
}

import { Mapper } from '@oney/common-core';
import { DebtStatus } from '@oney/payment-core';
import { injectable } from 'inversify';

@injectable()
export class SmoneyDebtStatusMapper implements Mapper<DebtStatus, number> {
  toDomain(smoneyStatus: number): DebtStatus {
    switch (smoneyStatus) {
      case 0:
        return DebtStatus.PENDING;
      case 1:
        return DebtStatus.RECOVERED;
      case 2:
        return DebtStatus.LOST;
      default:
        return null;
    }
  }

  fromDomain(raw: DebtStatus): number {
    switch (raw) {
      case DebtStatus.PENDING:
        return 0;
      case DebtStatus.RECOVERED:
        return 1;
      case DebtStatus.LOST:
        return 2;
      default:
        return null;
    }
  }
}

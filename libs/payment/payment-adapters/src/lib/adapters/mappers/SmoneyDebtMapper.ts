import { Mapper } from '@oney/common-core';
import { Debt, DebtProperties } from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { SmoneyDebtStatusMapper } from './SmoneyDebtStatusMapper';
import { SmoneyCurrencyUnitMapper } from './SmoneyCurrencyUnitMapper';
import { SmoneyDebt } from '../partners/smoney/api/SmoneyDebtApi';

@injectable()
export class SmoneyDebtMapper implements Mapper<Debt, SmoneyDebt> {
  constructor(
    @inject(SmoneyDebtStatusMapper)
    private readonly smoneyDebtStatusMapper: SmoneyDebtStatusMapper,
    @inject(SmoneyCurrencyUnitMapper)
    private readonly smoneyCurrencyUnitMapper: SmoneyCurrencyUnitMapper,
  ) {}
  toDomain(smoneyDebts: SmoneyDebt): Debt {
    const debtProperties: DebtProperties = {
      id: smoneyDebts.OrderId,
      userId: smoneyDebts.AppUserId,
      date: new Date(smoneyDebts.Date),
      debtAmount: this.smoneyCurrencyUnitMapper.toDomain(smoneyDebts.DebtAmount),
      remainingDebtAmount: this.smoneyCurrencyUnitMapper.toDomain(smoneyDebts.RemainingDebtAmount),
      status: this.smoneyDebtStatusMapper.toDomain(smoneyDebts.Status),
      reason: smoneyDebts.Reason,
      collections: [],
    };

    return new Debt(debtProperties);
  }

  fromDomain({ props: raw }: Debt): SmoneyDebt {
    const smoneyDebt: SmoneyDebt = {
      AppUserId: raw.userId,
      Date: raw.date.toString(),
      DebtAmount: this.smoneyCurrencyUnitMapper.fromDomain(raw.debtAmount),
      OrderId: raw.id,
      Reason: raw.reason,
      RemainingDebtAmount: this.smoneyCurrencyUnitMapper.fromDomain(raw.remainingDebtAmount),
      Status: this.smoneyDebtStatusMapper.fromDomain(raw.status),
    };
    return smoneyDebt;
  }
}

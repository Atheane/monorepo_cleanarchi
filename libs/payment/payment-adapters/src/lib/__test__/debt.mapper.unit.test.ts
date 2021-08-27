import 'reflect-metadata';
import { Debt, DebtStatus } from '@oney/payment-core';
import { SmoneyDebtMapper } from '../adapters/mappers/SmoneyDebtMapper';
import { SmoneyDebt } from '../adapters/partners/smoney/api/SmoneyDebtApi';
import { SmoneyDebtStatusMapper } from '../adapters/mappers/SmoneyDebtStatusMapper';
import { SmoneyCurrencyUnitMapper } from '../adapters/mappers/SmoneyCurrencyUnitMapper';

describe('test smoney debt mapper', () => {
  [
    { smoneyStatus: 0, debtStatus: DebtStatus.PENDING },
    { smoneyStatus: 1, debtStatus: DebtStatus.RECOVERED },
    { smoneyStatus: 2, debtStatus: DebtStatus.LOST },
    { smoneyStatus: 3, debtStatus: null },
  ].map(({ smoneyStatus, debtStatus }) => {
    it(`should map smoney debt status ${smoneyStatus} to domain debt status ${debtStatus}`, () => {
      const mapper = new SmoneyDebtStatusMapper();

      const result = mapper.toDomain(smoneyStatus);

      expect(result).toEqual(debtStatus);
    });
  });

  it('should map SmoneyDebt to Debt', () => {
    const mapper = new SmoneyDebtMapper(new SmoneyDebtStatusMapper(), new SmoneyCurrencyUnitMapper());
    const smoneyDebt: SmoneyDebt = {
      OrderId: '984563',
      AppUserId: 'client-112',
      Date: '2020-12-10T10:27:45',
      DebtAmount: 1000,
      RemainingDebtAmount: 500,
      Status: 0,
      Reason: 'P2P',
    };

    const result = mapper.toDomain(smoneyDebt);

    const expectedDebt = new Debt({
      id: '984563',
      userId: 'client-112',
      date: new Date('2020-12-10T10:27:45'),
      debtAmount: 10,
      remainingDebtAmount: 5,
      status: DebtStatus.PENDING,
      reason: 'P2P',
      collections: [],
    });
    expect(result).toEqual(expectedDebt);
  });

  it('should map domain debt status to smoney debt status', () => {
    const mapper = new SmoneyDebtStatusMapper();
    const debtStatusToTest = [
      { smoneyStatus: 0, debtStatus: DebtStatus.PENDING },
      { smoneyStatus: 1, debtStatus: DebtStatus.RECOVERED },
      { smoneyStatus: 2, debtStatus: DebtStatus.LOST },
      { smoneyStatus: null, debtStatus: 'UNKNOW' },
    ];

    expect(
      debtStatusToTest.map(({ debtStatus, smoneyStatus }) => {
        const status = debtStatus as DebtStatus;
        const statusMappedFromDomain = mapper.fromDomain(status);
        expect(statusMappedFromDomain).toBe(smoneyStatus);
      }),
    );
  });
});

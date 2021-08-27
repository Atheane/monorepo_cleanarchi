import 'reflect-metadata';
import { BankAccount, BankAccountProperties, Debt, DebtStatus } from '@oney/payment-core';

describe('Test bank account', () => {
  it('should add debt to bank account when there is no debts', () => {
    const bankAccountProperties = {
      uid: 'client-1',
      iban: 'iban',
      bic: 'bic',
      bankAccountId: 'bankAccountId',
    };
    const bankAccount = new BankAccount(bankAccountProperties);

    const aNewDebt = new Debt({
      id: 'debt-15',
      userId: 'client-1',
      date: new Date('2020-11-13T10:27:45'),
      debtAmount: 200,
      remainingDebtAmount: 200,
      status: DebtStatus.PENDING,
      reason: 'Cardoperation',
      collections: [],
    });
    bankAccount.createDebt(aNewDebt);

    expect(bankAccount.props.debts.length).toEqual(1);
    expect(bankAccount.props.debts).toEqual([aNewDebt]);
  });

  it('should add debt to bank account when there is already a debt', () => {
    const bankAccountProperties = {
      uid: 'client-1',
      iban: 'iban',
      bic: 'bic',
      bankAccountId: 'bankAccountId',
      debts: [getDebt('debt-11')],
    };
    const bankAccount = new BankAccount(bankAccountProperties);

    const aNewDebt = getDebt('debt-222');
    bankAccount.createDebt(aNewDebt);

    expect(bankAccount.props.debts.length).toEqual(2);
    expect(bankAccount.props.debts).toEqual([getDebt('debt-11'), aNewDebt]);
  });

  it('should update debt in bank account', () => {
    const bankAccountProperties = {
      uid: 'client-1',
      iban: 'iban',
      bic: 'bic',
      bankAccountId: 'bankAccountId',
      debts: [getDebt('debt-0', 200), getDebt('debt-11', 200)],
    };
    const bankAccount = new BankAccount(bankAccountProperties);

    const aNewUpdatedDebt = getDebt('debt-11', 8769);
    bankAccount.updateDebt(aNewUpdatedDebt);

    expect(bankAccount.props.debts.length).toEqual(2);
    expect(bankAccount.props.debts).toEqual([getDebt('debt-0', 200), aNewUpdatedDebt]);
  });

  const getDebt = (id: string, debtAmount?: number) => {
    return new Debt({
      id: id || 'debt-15',
      userId: 'client-1',
      date: new Date('2020-11-13T10:27:45'),
      debtAmount: debtAmount || 200,
      remainingDebtAmount: 200,
      status: DebtStatus.PENDING,
      reason: 'Cardoperation',
      collections: [],
    });
  };

  it('should calculate spentFunds with technicalLimit != globalOutMonthlyAllowance', () => {
    // params
    const globalOutMonthlyAllowance = 1000;
    const remainingFundToSpend = 0;
    const technicalLimit = 1100;
    const monthlyUsedAllowance = 800;

    const bankAccountProperties: BankAccountProperties = {
      productsEligibility: undefined,
      uncappingState: undefined,
      uid: 'client-1',
      iban: 'iban',
      bic: 'bic',
      bankAccountId: 'bankAccountId',
      debts: [getDebt('debt-0', 200), getDebt('debt-11', 200)],
      monthlyAllowance: {
        spentFunds: 0,
        authorizedAllowance: 0,
        remainingFundToSpend,
      },
      limits: {
        props: {
          globalOut: {
            weeklyAllowance: globalOutMonthlyAllowance,
            monthlyAllowance: globalOutMonthlyAllowance,
            annualAllowance: globalOutMonthlyAllowance * 12,
          },
          globalIn: {
            weeklyAllowance: 0,
            monthlyAllowance: 0,
            annualAllowance: 0,
          },
          balanceLimit: 0,
          technicalLimit,
        },
      },
    };

    const bankAccount = new BankAccount(bankAccountProperties);
    bankAccount.updateMonthlyAllowance(
      {
        authorizedAllowance: 0,
        remainingFundToSpend,
      },
      monthlyUsedAllowance,
    );

    expect(bankAccount.props.monthlyAllowance.spentFunds).toBe(700);
  });

  it('should calculate spentFunds with technicalLimit == globalOutMonthlyAllowance', () => {
    // params
    const globalOutMonthlyAllowance = 1000;
    const remainingFundToSpend = 0;
    const technicalLimit = 1000;
    const monthlyUsedAllowance = 800;

    const bankAccountProperties: BankAccountProperties = {
      productsEligibility: undefined,
      uncappingState: undefined,
      uid: 'client-1',
      iban: 'iban',
      bic: 'bic',
      bankAccountId: 'bankAccountId',
      debts: [getDebt('debt-0', 200), getDebt('debt-11', 200)],
      monthlyAllowance: {
        spentFunds: 0,
        authorizedAllowance: 0,
        remainingFundToSpend,
      },
      limits: {
        props: {
          globalOut: {
            weeklyAllowance: globalOutMonthlyAllowance,
            monthlyAllowance: globalOutMonthlyAllowance,
            annualAllowance: globalOutMonthlyAllowance * 12,
          },
          globalIn: {
            weeklyAllowance: 0,
            monthlyAllowance: 0,
            annualAllowance: 0,
          },
          balanceLimit: 0,
          technicalLimit,
        },
      },
    };

    const bankAccount = new BankAccount(bankAccountProperties);
    bankAccount.updateMonthlyAllowance(
      {
        authorizedAllowance: 0,
        remainingFundToSpend,
      },
      monthlyUsedAllowance,
    );

    expect(bankAccount.props.monthlyAllowance.spentFunds).toBe(800);
  });
});

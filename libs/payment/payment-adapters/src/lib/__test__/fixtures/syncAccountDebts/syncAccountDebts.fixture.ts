import { Debt, DebtProperties, DebtStatus } from '@oney/payment-core';

const firstDebt: DebtProperties = {
  date: new Date('2021-01-18T15:09:31.57Z'),
  collections: [],
  debtAmount: 10,
  id: 'FDEAED10122',
  reason: 'P2P',
  remainingDebtAmount: 10,
  status: DebtStatus.PENDING,
  userId: 'kTDhDRrHv',
};

const secondDebt: DebtProperties = {
  date: new Date('2021-01-18T13:35:15.403Z'),
  collections: [],
  debtAmount: 10,
  id: 'CDDFFC03204',
  reason: 'P2P',
  remainingDebtAmount: 10,
  status: DebtStatus.PENDING,
  userId: 'kTDhDRrHv',
};

export const debtsFromSmoney = [new Debt(firstDebt), new Debt(secondDebt)];

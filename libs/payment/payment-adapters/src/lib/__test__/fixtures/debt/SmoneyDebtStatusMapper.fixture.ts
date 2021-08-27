import { DebtStatus } from '@oney/payment-core';

export const DebtStatusToTest = [
  { smoneyStatus: 0, debtStatus: DebtStatus.PENDING },
  { smoneyStatus: 1, debtStatus: DebtStatus.RECOVERED },
  { smoneyStatus: 2, debtStatus: DebtStatus.LOST },
  { smoneyStatus: 3, debtStatus: null },
];

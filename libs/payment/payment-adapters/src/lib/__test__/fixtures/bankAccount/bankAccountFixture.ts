import { BankAccount, BankAccountProperties, Debt, DebtStatus, UncappingState } from '@oney/payment-core';

export const debtMocked = new Debt({
  id: 'FDEAED10122',
  userId: 'kTDhDRrHv',
  date: new Date('2021-01-18T15:09:31.570Z'),
  debtAmount: 1000,
  remainingDebtAmount: 1000,
  status: DebtStatus.PENDING,
  reason: 'P2P',
  collections: [],
});

export const basicBankAccountPropertiesMocked: BankAccountProperties = {
  uid: 'kTDhDRrHv',
  iban: 'FR5212869000020PC000001PR62',
  bic: 'SMOEFRP1',
  bankAccountId: 'kTDhDRrHv',
  cards: [],
  beneficiaries: [],
  debts: [],
  uncappingState: UncappingState.CAPPED,
  productsEligibility: {
    account: true,
    splitPayment: true,
  },
};

export const BankAccountWithDebtsPropertiesMocked: BankAccountProperties = {
  ...basicBankAccountPropertiesMocked,
  debts: [debtMocked],
};

export const basicBankAccountMocked = new BankAccount(basicBankAccountPropertiesMocked);
export const bankAccountWithDebtsMocked = new BankAccount(BankAccountWithDebtsPropertiesMocked);

import {
  BankAccount,
  BankAccountProperties,
  Debt,
  DebtProperties,
  DebtStatus,
  UncappingState,
} from '@oney/payment-core';

export const oldesDebttMocked: DebtProperties = {
  id: 'FDEAED10121',
  userId: 'kTDhDRrHv',
  date: new Date('2020-01-18T15:09:31.570Z'),
  debtAmount: 20,
  remainingDebtAmount: 20,
  status: DebtStatus.PENDING,
  reason: 'P2P',
  collections: [],
};

export const middleDatedDebt: DebtProperties = {
  id: 'FDEAED10123',
  userId: 'kTDhDRrHv',
  date: new Date('2021-01-02T15:09:31.570Z'),
  debtAmount: 80,
  remainingDebtAmount: 80,
  status: DebtStatus.PENDING,
  reason: 'P2P',
  collections: [],
};

export const newestDebtMocked: DebtProperties = {
  id: 'FDEAED10122',
  userId: 'kTDhDRrHv',
  date: new Date('2021-01-18T15:09:31.570Z'),
  debtAmount: 20,
  remainingDebtAmount: 20,
  status: DebtStatus.PENDING,
  reason: 'P2P',
  collections: [],
};

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

export const expectedOldestPartialDebtFirstCollection = {
  amount: 20,
  orderId: `I${oldesDebttMocked.id}0001`,
};
export const expectedOldestPartialDebtSecondCollection = {
  amount: 30,
  orderId: `I${oldesDebttMocked.id}0002`,
};

export const basicBankAccountMocked = new BankAccount(basicBankAccountPropertiesMocked);

export function getBasicBankAccountWithDebtsMockedInDB(): BankAccount {
  const BankAccountWithDebtsPropertiesMocked: BankAccountProperties = {
    ...basicBankAccountPropertiesMocked,
    debts: [new Debt(newestDebtMocked), new Debt(oldesDebttMocked), new Debt(middleDatedDebt)],
  };

  return new BankAccount(BankAccountWithDebtsPropertiesMocked);
}

export const PayedDebt = {
  FIRST: 0,
  SECOND: 1,
  THRID: 2,
};

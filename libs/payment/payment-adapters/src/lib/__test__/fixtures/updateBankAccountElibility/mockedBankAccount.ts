import { BankAccount, BankAccountProperties, UncappingState } from '@oney/payment-core';

export const bankAccountBasicProperties: BankAccountProperties = {
  uid: 'kTDhDRrHv',
  iban: 'FR5212869000020PC000001PR62',
  bic: 'SMOEFRP1',
  bankAccountId: 'bankAccountId',
  cards: [],
  monthlyAllowance: {
    remainingFundToSpend: 0,
    authorizedAllowance: 100,
  },
  beneficiaries: [],
  debts: [],
  uncappingState: UncappingState.CAPPED,
  productsEligibility: {
    account: false,
    splitPayment: true,
  },
};

export const mockedBankAccountWithProductsEligibility = new BankAccount(bankAccountBasicProperties);

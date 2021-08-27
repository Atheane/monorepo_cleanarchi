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
  limits: {
    props: {
      balanceLimit: 0,
      technicalLimit: 2000,
      globalOut: {
        annualAllowance: 45000,
        monthlyAllowance: 2000,
        weeklyAllowance: 2000,
      },
    },
  },
};
export const bankAccountBasicPropertiesNotTechnicalLimitYet: BankAccountProperties = {
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
  limits: {
    props: {
      balanceLimit: 0,
      globalOut: {
        annualAllowance: 45000,
        monthlyAllowance: 2500,
        weeklyAllowance: 2500,
      },
    },
  },
};
export const mockedBankAccountUpateLimits = new BankAccount(bankAccountBasicProperties);

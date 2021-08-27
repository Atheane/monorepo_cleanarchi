import { CardType } from '@oney/payment-messages';
import {
  BankAccount,
  Beneficiary,
  Card,
  CardPreferences,
  CardStatus,
  UncappingState,
} from '@oney/payment-core';

export const mockedBankAccountProps = {
  uid: 'kTDhDRrHv',
  iban: 'FR5212869000020PC000001PR62',
  bic: 'SMOEFRP1',
  bankAccountId: 'bankAccountId',
  cards: [
    new Card({
      id: 'card-Sk-EqA1Bw',
      hasPin: true,
      ownerId: 'kTDhDRrHv',
      pan: '9396XXXXXXXX0784',
      preferences: new CardPreferences({
        atmWeeklyAllowance: 300,
        atmWeeklyUsedAllowance: 300,
        blocked: false,
        foreignPayment: true,
        internetPayment: true,
        monthlyAllowance: 1000,
        monthlyUsedAllowance: 389,
      }),
      ref: 'test',
      status: CardStatus.ACTIVATED,
      type: CardType.PHYSICAL_CLASSIC,
    }),
  ],
  monthlyAllowance: {
    remainingFundToSpend: 0,
    authorizedAllowance: 100,
  },
  beneficiaries: [
    new Beneficiary({
      id: 'idBenef',
      bic: 'bicbenef',
      email: 'emailbenef',
      name: 'nameBenef',
      status: 1,
      iban: 'testIban',
    }),
    new Beneficiary({
      id: 'idBenef2',
      bic: 'bicbenef2',
      email: 'emailbenef2',
      name: 'nameBenef2',
      status: 2,
      iban: 'testIban',
    }),
  ],
  debts: [],
};

export const mockedBankAccount = new BankAccount(mockedBankAccountProps);

export const mockedLimitedBankAccount = new BankAccount({
  productsEligibility: undefined,
  uid: 'tstUsr106',
  iban: 'FR5212869000020PC000001PR62',
  bic: 'SMOEFRP1',
  bankAccountId: 'bankAccountId',
  cards: [
    new Card({
      id: 'card-Sk-EqA1Bw',
      hasPin: true,
      ownerId: 'kTDhDRrHv',
      pan: '9396XXXXXXXX0784',
      preferences: new CardPreferences({
        atmWeeklyAllowance: 300,
        atmWeeklyUsedAllowance: 300,
        blocked: false,
        foreignPayment: true,
        internetPayment: true,
        monthlyAllowance: 1000,
        monthlyUsedAllowance: 389,
      }),
      ref: 'test',
      status: CardStatus.ACTIVATED,
      type: CardType.PHYSICAL_CLASSIC,
    }),
  ],
  monthlyAllowance: {
    remainingFundToSpend: 0,
    authorizedAllowance: 100,
  },
  beneficiaries: [
    new Beneficiary({
      id: 'idBenef',
      bic: 'bicbenef',
      email: 'emailbenef',
      name: 'nameBenef',
      status: 1,
      iban: 'iban',
    }),
    new Beneficiary({
      id: 'idBenef2',
      bic: 'bicbenef2',
      email: 'emailbenef2',
      name: 'nameBenef2',
      status: 2,
      iban: 'iban',
    }),
  ],
  debts: [],
  uncappingState: UncappingState.CAPPED,
  limits: {
    props: {
      globalOut: {
        weeklyAllowance: 1000,
        monthlyAllowance: 1000,
        annualAllowance: 12000,
      },
      globalIn: {
        weeklyAllowance: 0,
        monthlyAllowance: 0,
        annualAllowance: 0,
      },
      balanceLimit: 1000,
      technicalLimit: 1000,
    },
  },
});

export const mockedUncappedBankAccount = new BankAccount({
  uid: 'tstUsr110',
  iban: 'FR5212869000020PC000001PR70',
  bic: 'SMOEFRP1',
  bankAccountId: 'bankAccountId',
  uncappingState: UncappingState.UNCAPPED,
  cards: [],
  monthlyAllowance: {
    remainingFundToSpend: 0,
    authorizedAllowance: 100,
  },
  beneficiaries: [],
  debts: [],
  limits: {
    props: {
      globalOut: {
        weeklyAllowance: 0,
        monthlyAllowance: 0,
        annualAllowance: 0,
      },
      globalIn: {
        weeklyAllowance: 0,
        monthlyAllowance: 0,
        annualAllowance: 0,
      },
      balanceLimit: 0,
    },
  },
});

export const bankAccountWithJustConstructedLimits = new BankAccount({
  productsEligibility: undefined,
  uid: 'tstUsr106',
  iban: 'FR5212869000020PC000001PR62',
  bic: 'SMOEFRP1',
  bankAccountId: 'bankAccountId',
  cards: [
    new Card({
      id: 'card-Sk-EqA1Bw',
      hasPin: true,
      ownerId: 'kTDhDRrHv',
      pan: '9396XXXXXXXX0784',
      preferences: new CardPreferences({
        atmWeeklyAllowance: 300,
        atmWeeklyUsedAllowance: 300,
        blocked: false,
        foreignPayment: true,
        internetPayment: true,
        monthlyAllowance: 1000,
        monthlyUsedAllowance: 389,
      }),
      ref: 'test',
      status: CardStatus.ACTIVATED,
      type: CardType.PHYSICAL_CLASSIC,
    }),
  ],
  monthlyAllowance: {
    remainingFundToSpend: 0,
    authorizedAllowance: 100,
    spentFunds: 100,
  },
  beneficiaries: [],
  debts: [],
  uncappingState: UncappingState.CAPPED,
  limits: {
    props: {
      globalOut: {
        weeklyAllowance: 0,
        monthlyAllowance: 0,
        annualAllowance: 0,
      },
      globalIn: {
        weeklyAllowance: 0,
        monthlyAllowance: 0,
        annualAllowance: 0,
      },
      balanceLimit: 0,
      technicalLimit: 0,
    },
  },
});

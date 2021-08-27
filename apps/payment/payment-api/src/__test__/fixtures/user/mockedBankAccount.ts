import {
  BankAccount,
  Beneficiary,
  Card,
  CardPreferences,
  CardStatus,
  Debt,
  DebtProperties,
  DebtStatus,
  DiligenceStatus,
  DiligencesType,
} from '@oney/payment-core';
import { UncappingState } from '@oney/payment-core';
import { CardType } from '@oney/payment-messages';
import { BankAccountDTO } from '../../../modules/user/dto/BankAccountDTO';

export const mockedLimits = {
  balanceLimit: 0,
  technicalLimit: 0,
  globalIn: {
    annualAllowance: 0,
    monthlyAllowance: 0,
    weeklyAllowance: 0,
  },
  globalOut: {
    annualAllowance: 0,
    monthlyAllowance: 0,
    weeklyAllowance: 0,
  },
};

export const mockedBankAccount = new BankAccount({
  uid: 'kTDhDRrHv',
  iban: 'FR5212869000020PC000001PR62',
  bic: 'SMOEFRP1',
  bankAccountId: '2926',
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
    spentFunds: 0,
  },
  kycDiligenceStatus: DiligenceStatus.VALIDATED,
  kycDiligenceValidationMethod: DiligencesType.AGGREGATION,
  beneficiaries: [
    new Beneficiary({
      id: '815',
      bic: 'BDFEFRPPXXX',
      email: 'email@oney.com',
      iban: 'FR7630001007941234567890000',
      name: 'Fakeuser',
      status: 1,
    }),
  ],
  debts: [
    new Debt({
      id: 'FDEAED10122',
      userId: 'kTDhDRrHv',
      date: new Date('2021-01-18T15:09:31.570Z'),
      debtAmount: 1000,
      remainingDebtAmount: 1000,
      status: DebtStatus.PENDING,
      reason: 'P2P',
    } as DebtProperties),
  ],
  uncappingState: UncappingState.CAPPED,
});

export const expectedBankAccount = {
  ...mockedBankAccount.props,
  beneficiaries: [
    {
      id: '815',
      bic: 'BDFEFRPPXXX',
      email: 'email@oney.com',
      iban: 'FR7630001007941234567890000',
      name: 'Fakeuser',
      status: 1,
    },
  ],
  cards: [
    {
      id: 'card-Sk-EqA1Bw',
      hasPin: true,
      ownerId: 'kTDhDRrHv',
      pan: '9396XXXXXXXX0784',
      preferences: {
        atmWeeklyAllowance: 300,
        atmWeeklyUsedAllowance: 300,
        blocked: false,
        foreignPayment: true,
        internetPayment: true,
        monthlyAllowance: 1000,
        monthlyUsedAllowance: 389,
      },
      ref: 'test',
      status: 'activated',
      type: 'physical_classic',
    },
  ],
  debts: [
    {
      id: 'FDEAED10122',
      userId: 'kTDhDRrHv',
      date: '2021-01-18T15:09:31.570Z',
      debtAmount: 1000,
      remainingDebtAmount: 1000,
      status: 'PENDING',
      reason: 'P2P',
      collections: [],
    },
  ],
  limits: mockedLimits,
  isUncapped: false,
};

export const mockedBankAccountWithOptionalFieldsUnfilled = new BankAccount({
  uid: 'fakeId',
  iban: 'FR5212869000020PC000001PR62',
  bic: 'SMOEFRP1',
  bankAccountId: '2921',
  cards: [],
  beneficiaries: [],
  debts: [],
  monthlyAllowance: {
    authorizedAllowance: 1000,
    remainingFundToSpend: 1000,
  },
  kycDiligenceStatus: DiligenceStatus.TODO,
  kycDiligenceValidationMethod: DiligencesType.UNKNOWN,
  limits: {
    props: {
      balanceLimit: 0,
      globalIn: {
        annualAllowance: 0,
        monthlyAllowance: 0,
        weeklyAllowance: 0,
      },
    },
  },
  uncappingState: UncappingState.CAPPED,
});

export const expectedBankAccountWithOptionalFieldsUnfilled: BankAccountDTO = {
  ...mockedBankAccountWithOptionalFieldsUnfilled.props,
  beneficiaries: [],
  cards: [],
  debts: [],
  // creating optional key "limits"
  ...(mockedBankAccountWithOptionalFieldsUnfilled.props.limits?.props && {
    limits: mockedBankAccountWithOptionalFieldsUnfilled.props.limits.props,
  }),
  isUncapped: mockedBankAccountWithOptionalFieldsUnfilled.props.uncappingState === UncappingState.UNCAPPED,
};

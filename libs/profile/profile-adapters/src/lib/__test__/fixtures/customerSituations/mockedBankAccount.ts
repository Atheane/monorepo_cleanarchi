import { BankAccount, Card, CardPreferences, CardStatus } from '@oney/payment-core';
import { CardType } from '@oney/payment-messages';

export const mockedBankAccount = new BankAccount({
  uid: 'beGe_flCm',
  iban: 'FR5212869000020PC000001PR62',
  bic: 'SMOEFRP1',
  bankAccountId: 'beGe_flCm',
  cards: [
    new Card({
      id: 'card-Sk-EqA1Bw',
      ownerId: 'beGe_flCm',
      pan: '9396XXXXXXXX0784',
      ref: 'test',
      status: CardStatus.ACTIVATED,
      type: CardType.PHYSICAL_CLASSIC,
      hasPin: true,
      preferences: new CardPreferences({
        blocked: false,
        foreignPayment: true,
        internetPayment: true,
        atmWeeklyAllowance: 300,
        atmWeeklyUsedAllowance: 0,
        monthlyAllowance: 1000,
        monthlyUsedAllowance: 389,
      }),
    }),
  ],
  beneficiaries: [],
  debts: [],
});

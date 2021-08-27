import { UncappingState } from '@oney/payment-core';

export const addBeneficiaryMockBankAccount = {
  uid: 'UpmekTXcJ',
  bid: '7188',
  iban: 'FR4112869000020PC000005JO21',
  cards: [
    {
      cid: 'card-BGBpCxjZO',
      uniqueId: '1286900002P9AkFkWGIE23S5VmYvfkww',
      pan: '9396XXXXXXXX6907',
      status: 1,
      cardType: 2,
      hasPin: false,
      blocked: false,
      foreignPayment: true,
      internetPayment: true,
      atmWeeklyAllowance: 300,
      atmWeeklyUsedAllowance: 0,
      monthlyAllowance: 3000,
      monthlyUsedAllowance: 0,
    },
  ],
  beneficiaries: [],
  bic: 'BACCFR23XXX',
  monthlyAllowance: {
    authorizedAllowance: 0,
    remainingFundToSpend: 0,
    spentFunds: 0,
  },
  uncappingState: UncappingState.CAPPED,
  productsEligibility: {
    account: false,
    splitPayment: true,
  },
};

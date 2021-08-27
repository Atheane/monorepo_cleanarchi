import { UncappingState } from '@oney/payment-core';

export const mockyBankAccount = {
  _id: '5f606c39d6a9980011db3052',
  uid: '_lHXbttPN',
  bid: '454',
  iban: 'FR4512869000020P0000000CM62',
  bic: 'SMOEFRP1',
  cards: [],
  beneficiaries: [
    {
      _id: '5fad1e587337170012b63613',
      bic: 'BAxxxx23',
      bid: '1517',
      email: 'conor@oney.com',
      iban: 'FR72XXXXXXXXXXXXXXXXJE22',
      name: 'Conor Mc Gregor',
      status: 1,
    },
    {
      _id: '5fad1e5f96b78a00125ab684',
      bic: 'BAxxxx23',
      bid: '1518',
      email: 'conor@ufc.com',
      iban: 'FR72XXXXXXXXXXXXXXXXJE22',
      name: 'Conor Mc Gregor',
      status: 1,
    },
    {
      _id: '5fad1f0f7337170012b63614',
      bic: 'BAxxxx23',
      bid: '1519',
      email: 'conor@ufc.com',
      iban: 'FR72XXXXXXXXXXXXXXXXJE22',
      name: 'Conor Mc Gregor',
      status: 1,
    },
  ],
  __v: 9,
};

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

export const addBeneficiaryDomainEvent = {
  id: 'uuid_v4_example',
  metadata: {
    aggregate: 'BankAccount',
    aggregateId: 'UpmekTXcJ',
  },
  props: {
    bic: 'BAxxxxxxxXX',
    email: 'lagrossemoula@yopmail.com',
    iban: 'FR41XXXXXXXXXXXXXXXXJN24',
    id: 3840,
    name: 'Beneficiary guy',
    status: 1,
  },
};

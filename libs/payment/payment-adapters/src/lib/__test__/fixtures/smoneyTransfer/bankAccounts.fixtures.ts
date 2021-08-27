import { DiligenceStatus, DiligencesType } from '@oney/payment-core';

export const senderBankAccount = {
  uid: '_lHXbttPN',
  bid: '454',
  iban: 'FR4512869000020P0000000CM62',
  bic: 'BACCFR23XXX',
  cards: [
    {
      _id: '5f773cb7ae9a7400113a1370',
      cid: 'card-h6tK2H5NI',
      pan: '4396XXXXXXXX9103',
      status: 1,
      cardType: 2,
      blocked: false,
      foreignPayment: true,
      internetPayment: true,
      atmWeeklyAllowance: 2.5,
      atmWeeklyUsedAllowance: 0,
      monthlyAllowance: 3,
      monthlyUsedAllowance: 0,
    },
  ],
  beneficiaries: [
    {
      bic: 'BACCFR23XXX',
      bid: '5846',
      email: 'antonebogisich398dev@mailsac.com',
      iban: 'FR91XXXXXXXXXXXXXXXXUR37',
      name: 'Antone BOGISICH',
      status: 1,
    },
    {
      bic: 'ABxxxxxxxXX',
      bid: '3067',
      email: 'compteextsepa1@mailsac.com',
      iban: 'GB25XXXXXXXXXXX6084',
      name: 'Compte ext SEPA 1',
      status: 1,
    },
  ],
};

export const beneficiaryBankAccount = {
  uid: 'aTat_QPNx',
  bid: '5846',
  iban: 'FR2512869000020PC000004IE84',
  bic: 'BACCFR23XXX',
  cards: [
    {
      _id: '5f773cb7ae9a7400113a1370',
      cid: 'card-h6tK2H5NI',
      pan: '4396XXXXXXXX9103',
      status: 1,
      cardType: 2,
      blocked: false,
      foreignPayment: true,
      internetPayment: true,
      atmWeeklyAllowance: 2.5,
      atmWeeklyUsedAllowance: 0,
      monthlyAllowance: 3,
      monthlyUsedAllowance: 0,
    },
  ],
  kycDiligenceStatus: DiligenceStatus.VALIDATED,
  kycDiligenceValidationMethod: DiligencesType.AGGREGATION,
  beneficiaries: [],
};

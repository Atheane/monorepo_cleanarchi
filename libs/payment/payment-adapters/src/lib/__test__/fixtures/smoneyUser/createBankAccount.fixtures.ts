export const bankAccountOpenedDomainEvent = {
  id: 'uuid_v4_example',
  props: {
    uid: 'yDvDwEHPq',
    bid: '4604',
    iban: 'FR7412869000020PC000003JW39',
    bic: 'BACCFR23XXX',
  },
  metadata: {
    aggregate: 'BankAccount',
    aggregateId: 'yDvDwEHPq',
  },
};

export const bankAccountCreatedDomainEvent = {
  id: 'uuid_v4_example',
  props: {
    uid: 'yDvDwEHPq',
    firstName: 'Djjd',
    lastName: 'Djfj',
    email: 'jeromyziemann796dev@mailsac.com',
    birthCountry: 'AG',
    birthDate: '1983-02-11T00:00:00.000Z',
    address: {
      city: 'Créteil',
      country: 'FR',
      street: '5 rue paul cezanne',
      zipCode: '94000',
    },
    phone: '+33646484841',
  },
  metadata: {
    aggregate: 'BankAccount',
    aggregateId: 'yDvDwEHPq',
  },
};

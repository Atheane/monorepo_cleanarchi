import { BankAccountCreated } from '@oney/payment-messages';

export const bankAccountCreatedMessage: BankAccountCreated = {
  id: 'aozekoazek',
  props: {
    uid: 'azi6FGHCYDE',
    firstName: 'kara',
    lastName: 'Trace',
    birthCountry: 'kobol',
    email: 'kara.trace@perche.com',
    birthDate: new Date('06-10-1984'),
    address: {
      street: 'grande route',
      city: 'centre',
      zipCode: '12345',
      country: 'KOBOL',
    },
    phone: '0760066780',
  },
};

import { RecipientDaoProperties } from '../../../database/RecipientDaoProperties';

export const recipientToSaveInDbMocked: RecipientDaoProperties = {
  uid: 'OsYFhvKAT',
  profile: {
    address: {
      street: '22 RUE DU PETIT NOYER',
      city: 'AULNAY SOUS BOIS',
      zipCode: '93600',
      country: 'FR',
    },
    firstName: 'Samy',
    lastName: 'Gotrois',
    birthDate: new Date('1992-11-15'),
    birthCountry: 'FR',
    email: 'my@email.com',
    phone: '12344321',
  },
  preferences: {
    allowAccountNotifications: true,
    allowTransactionNotifications: true,
  },
};

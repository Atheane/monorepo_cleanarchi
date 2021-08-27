import { Preferences, PreferencesProperties } from '../../domain/valuesObjects/Preferences';
import { Address } from '../../domain/valuesObjects/Address';
import { Profile, ProfileProperties } from '../../domain/valuesObjects/Profile';

export const mockedProfile: ProfileProperties = {
  address: Address.create({
    street: '22 RUE DU PETIT NOYER',
    city: 'AULNAY SOUS BOIS',
    zipCode: '93600',
    country: 'FR',
    additionalStreet: 'Adresse aditional Fake',
  }),
  firstName: 'Samy',
  lastName: 'Gotrois',
  birthDate: new Date('1992-11-15'),
  birthCountry: 'FR',
  email: 'my@email.com',
  phone: '12344321',
};

export const preferencesMocked: PreferencesProperties = {
  allowAccountNotifications: true,
  allowTransactionNotifications: true,
};

export const registerRecipientCommandMocked = {
  uid: 'kTDhDRrHv',
  profile: mockedProfile,
};

export const expectedRecipientRegistered = {
  uid: 'kTDhDRrHv',
  profile: Profile.create(mockedProfile),
  preferences: Preferences.create(preferencesMocked),
};

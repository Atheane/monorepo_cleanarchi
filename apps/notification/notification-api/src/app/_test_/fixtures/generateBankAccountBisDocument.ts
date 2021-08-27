import * as fs from 'fs';
import { RecipientDaoProperties } from '../../database/RecipientDaoProperties';
import { RecipientProperties } from '../../domain/entities/Recipient';
import { Address } from '../../domain/valuesObjects/Address';
import { Preferences } from '../../domain/valuesObjects/Preferences';
import { Profile, ProfileProperties } from '../../domain/valuesObjects/Profile';
import { GenerateBankAccountBisDocumentCommand } from '../../usecase/recipient/GenerateBankAccountBisDocument';

export const recipientToSaveInDbMocked: RecipientDaoProperties = {
  uid: 'kTDhDRrHv',
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

export const recipientProfileMocked: ProfileProperties = {
  address: Address.create({
    street: '22 RUE DU PETIT NOYER',
    city: 'AULNAY SOUS BOIS',
    zipCode: '93600',
    country: 'FR',
  }),
  firstName: 'Samy',
  lastName: 'Gotrois',
  birthDate: new Date('1992-11-15'),
  birthCountry: 'FR',
  email: 'my@email.com',
  phone: '12344321',
};
export const recipientMocked: RecipientProperties = {
  uid: 'kTDhDRrHv',
  profile: Profile.create(recipientProfileMocked),
  preferences: Preferences.create({
    allowAccountNotifications: true,
    allowTransactionNotifications: true,
  }),
};

export const gerateBankAccountBisCommandMocked: GenerateBankAccountBisDocumentCommand = {
  uid: 'kTDhDRrHv',
  bid: '1234',
  iban: 'FR6312869000020PC0000023D91',
  bic: 'SMOEFRP1',
};

export const content = fs.readFileSync(`${__dirname}/bisGenerated.txt`, 'utf8');

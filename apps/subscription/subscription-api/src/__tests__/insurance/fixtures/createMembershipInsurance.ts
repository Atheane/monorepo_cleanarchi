import {
  AddressStepValidated,
  CivilStatusValidated,
  HonorificCode,
  PhoneStepValidated,
  ProfileCreated,
  ProfileStatus,
} from '@oney/profile-messages';
import { BankAccountOpened, CardCreated, CardStatus, CardType } from '@oney/payment-messages';
import { CreateMembership, SubscriptionActivated, SubscriptionStatus } from '@oney/subscription-messages';

export const events = {
  profileCreated: new ProfileCreated({
    uid: 'theUID',
    email: 'john.doe@email.fr',
    steps: [],
    digitalIdentityId: '',
    status: ProfileStatus.ON_BOARDING,
  }),
  phoneStepValidated: new PhoneStepValidated({
    phone: '+33606060606',
  }),
  civilStatusValidated: new CivilStatusValidated({
    honorificCode: HonorificCode.MALE,
    firstName: 'John',
    legalName: 'Married Doe',
    birthName: 'Doe',
    birthDate: new Date('1990-01-01'),
    birthCountry: 'FR',
    birthCity: 'Paris',
    nationalityCountryCode: 'FR',
  }),
  civilStatusValidatedJustBirthName: new CivilStatusValidated({
    honorificCode: HonorificCode.MALE,
    firstName: 'John',
    legalName: null,
    birthName: 'Doe',
    birthDate: new Date('1990-01-01'),
    birthCountry: 'FR',
    birthCity: 'Paris',
    nationalityCountryCode: 'FR',
  }),
  addressValidated: new AddressStepValidated({
    street: '1 rue de test',
    additionalStreet: 'Appartement 2',
    city: 'Paris',
    zipCode: '75010',
    country: 'FR',
  }),
  bankAccountOpened: new BankAccountOpened({
    uid: 'theUID',
    bid: 'theBID',
    iban: 'FR2212869000020P0000007PN70',
    bic: 'BACCFR23XXX',
  }),
  cardCreated: new CardCreated({
    id: 'theCardId',
    ownerId: 'theUID',
    ref: 'theCardRef',
    type: CardType.PHYSICAL_CLASSIC,
    status: CardStatus.ORDERED,
    pan: '4396XXXXXXXX6499',
  }),
  subscriptionActivated: new SubscriptionActivated({
    subscriberId: 'theUID',
    nextBillingDate: new Date(),
    status: SubscriptionStatus.ACTIVE,
  }),
};

export const createMembershipCommand = new CreateMembership({
  subscriptionId: 'theUID',
  profileInfo: {
    honorificCode: HonorificCode.MALE,
    firstName: 'John',
    legalName: 'Doe',
    birthDate: new Date('1990-01-01'),
    email: 'john.doe@email.fr',
    phone: '+33606060606',
    address: {
      street: '1 rue de test',
      additionalStreet: 'Appartement 2',
      city: 'Paris',
      zipCode: '75010',
      country: 'FR',
    },
  },
  bankAccountInfo: {
    iban: 'FR2212869000020P0000007PN70',
    bic: 'BACCFR23XXX',
  },
  creditCardInfo: {
    pan: '4396XXXXXXXX6499',
  },
});

export const mockedSagaState = {
  instanceId: 'theSubscriptionID',
  subscriberId: 'theUID',
  profile: {
    honorificCode: HonorificCode.MALE,
    firstName: 'John',
    legalName: 'Doe',
    birthDate: new Date('1990-01-01'),
    email: 'john.doe@email.fr',
    phone: '+33606060606',
    address: {
      street: '1 rue de test',
      additionalStreet: 'Appartement 2',
      city: 'Paris',
      zipCode: '75010',
      country: 'FR',
    },
  },
  bankAccountInfo: { iban: 'FR2212869000020P0000007PN70', bic: 'BACCFR23XXX' },
  subscriptionId: 'theSubscriptionID',
  offerType: 2,
  creditCardInfo: { pan: '4396XXXXXXXX6499' },
};

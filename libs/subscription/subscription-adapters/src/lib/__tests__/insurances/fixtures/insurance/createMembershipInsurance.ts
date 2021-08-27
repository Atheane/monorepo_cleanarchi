import { CreateInsuranceMembershipRequest, Subscription } from '@oney/subscription-core';
import { CreateMembershipCommand, OfferType } from '@oney/subscription-messages';
import { HonorificCode } from '@oney/profile-messages';
import { SPBCreateMembershipRequest } from '../../../../adapters/partners/spb/models/membership/SPBCreateMembershipRequest';
import { SpbOfferTypes } from '../../../../adapters/partners/spb/models/types/SpbOfferTypes';
import { CustomerTitle } from '../../../../adapters/partners/spb/models/types/CustomerTitle';
import { AddressType } from '../../../../adapters/partners/spb/models/types/AddressType';
import { AddressNature } from '../../../../adapters/partners/spb/models/types/AddressNature';
import { BankRole } from '../../../../adapters/partners/spb/models/types/BankRole';

export const mockedSubscription = new Subscription({
  id: 'theSubscriptionId',
  subscriberId: 'theSubscriberId',
  offerId: 'c7cf068d-77ae-46b0-bf1f-afd938f4fc85',
  activationDate: new Date('2021-04-21'),
  nextBillingDate: new Date('2021-05-21'),
  cardId: 'theCardId',
});

export const createMembershipCommand: CreateMembershipCommand = {
  subscriptionId: 'theSubscriptionId',
  profileInfo: {
    honorificCode: HonorificCode.MALE,
    firstName: 'John',
    legalName: 'Doe',
    birthDate: new Date('1990-01-01'),
    email: 'john.doe@email.fr',
    phone: '+3361010101',
    address: {
      street: '1 rue de test',
      additionalStreet: 'appartement 2',
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
};

export const createMembershipRequest: CreateInsuranceMembershipRequest = {
  offerType: OfferType.ONEY_FIRST,
  profileInfo: {
    honorificCode: HonorificCode.MALE,
    firstName: 'John',
    legalName: 'Doe',
    birthDate: new Date('1990-01-01'),
    email: 'john.doe@email.fr',
    phone: '+3361010101',
    address: {
      street: '1 rue de test',
      additionalStreet: 'appartement 2',
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
};

export const SPBConfig = {
  spbApiConfiguration: {
    spbAuthApi: 'https://recex-sso.spb.eu',
    grantType: 'password',
    clientId: 'external-account',
    clientSecret: '019b7c58-f30d-45e6-bd26-c5ce794a6cfb',
    clientCredentials: 'password',
    username: 'oney-bank',
    password: 'Cnvmo&R3W4yDK#qbw?A;',
    spbBaseApi: 'https://recex-spb-gw-api.spb.eu',
    bin8MissingChar: '1100',
  },
};

export const spbCreateMembershipRequest: SPBCreateMembershipRequest = {
  offerUIDs: [SpbOfferTypes.ONEYBDPREMIER_001],
  customer: {
    title: CustomerTitle.MR,
    firstName: createMembershipCommand.profileInfo.firstName,
    lastName: createMembershipCommand.profileInfo.legalName,
    birthdate: '1990-01-01',
    email: createMembershipCommand.profileInfo.email,
    mobileNumber: createMembershipCommand.profileInfo.phone,
    address: {
      addressType: AddressType.STREET,
      addressNature: AddressNature.MAIN,
      iso2country: createMembershipCommand.profileInfo.address.country,
      correspondence: false,
      city: createMembershipCommand.profileInfo.address.city,
      zipCode: createMembershipCommand.profileInfo.address.zipCode,
      address: createMembershipCommand.profileInfo.address.street,
      additionalAddress: createMembershipCommand.profileInfo.address.additionalStreet,
    },
    bankingInfo: {
      bankAccountHolder: 'MR Doe John',
      iban: createMembershipCommand.bankAccountInfo.iban,
      bic: createMembershipCommand.bankAccountInfo.bic,
      bankCard: {
        pan: '43961100xxxx6499',
      },
      role: BankRole.SUBSCRIBER,
    },
  },
};

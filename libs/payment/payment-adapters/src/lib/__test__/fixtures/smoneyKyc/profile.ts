import { KycFraudType } from '@oney/payment-core';
import {
  DocumentSide,
  DocumentType,
  HonorificCode,
  KycDecisionType,
  ProfileStatus,
} from '@oney/profile-messages';

export const profileProps = {
  uid: 'xwAXKChwm',
  email: 'testemail@email.fr',
  enabled: false,
  informations: {
    status: ProfileStatus.ACTIVE,
    honorificCode: HonorificCode.MALE,
    birthName: 'test',
    legalName: 'test',
    firstName: 'test',
    birthDate: new Date(),
    birthCity: 'test',
    birthCountry: 'test',
    nationalityCountryCode: 'test',
    phone: 'test',
    economicActivity: 11,
    earningsAmount: 10000,
    fiscalCountry: 'test',
    address: {
      street: 'test',
      city: 'test',
      zipCode: 'test',
      country: 'test',
    },
  },
  kyc: {
    caseReference: 'test',
    caseId: 123456,
    decision: KycDecisionType.OK,
    decisionScore: 90,
    politicallyExposed: KycDecisionType.OK,
    sanctioned: KycDecisionType.OK,
    fraud: KycFraudType.RISK_HIGH,
  },
  digitalIdentityId: 'test',
  documents: [
    {
      location: 'xwAXKChwm/kyc/id-back_1607558400000.jpg',
      side: DocumentSide.BACK,
      type: DocumentType.ID_DOCUMENT,
    },
    {
      location: 'xwAXKChwm/kyc/id-front_1607558400000.jpg',
      side: DocumentSide.FRONT,
      type: DocumentType.ID_DOCUMENT,
    },
  ],
};

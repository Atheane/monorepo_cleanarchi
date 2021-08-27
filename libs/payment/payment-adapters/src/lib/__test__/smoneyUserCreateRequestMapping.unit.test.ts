/**
 * @jest-environment node
 */
import 'reflect-metadata';
import {
  DocumentSide,
  DocumentType,
  HonorificCode,
  KycDecisionType,
  ProfileStatus,
  ProfileInfos,
} from '@oney/profile-messages';
import { SmoneyCreateBankAccountMapper } from '../adapters/mappers/SmoneyCreateBankAccountMapper';

describe('SMoney User creation unit testing', () => {
  const profileInfos: ProfileInfos = {
    informations: {
      phone: '+33660708090',
      legalName: 'legal name',
      firstName: 'ellezam',
      honorificCode: HonorificCode.MALE,
      birthDate: new Date('1993-01-24T23:00:00.000Z'),
      birthCountry: 'AD',
      birthCity: 'Bxfj',
      address: {
        city: 'Créteil',
        country: 'FR',
        street: '5 rue paul cezanne appartement 00',
        zipCode: '94000',
      },
      nationalityCountryCode: 'AD',
      birthName: 'chalom',
      earningsAmount: null,
      fiscalCountry: 'FR',
      economicActivity: null,
      status: ProfileStatus.ON_BOARDING,
      fiscalReference: null,
      birthDepartmentCode: '75',
      birthDistrictCode: '01',
    },
    kyc: {
      decision: KycDecisionType.OK,
      politicallyExposed: KycDecisionType.OK_MANUAL,
      sanctioned: KycDecisionType.OK_MANUAL,
      documents: [
        {
          type: DocumentType.ID_DOCUMENT,
          side: DocumentSide.FRONT,
          location: 'VkYdtdLoq/kyc/id-front_1618232234490.jpg',
        },
      ],
    },
    email: 'al04@yopmail.com',
    uid: 'foypjkvXH',
    enabled: true,
  };

  it('SmoneyCreateBankAccountMapper should map SMO.BirthName to ODB.BirthName', async () => {
    const smoneyCreateUserRequest = new SmoneyCreateBankAccountMapper().fromDomain(profileInfos);

    expect(smoneyCreateUserRequest.Profile.BirthName).toEqual(profileInfos.informations.birthName);
  });

  it('SmoneyCreateBankAccountMapper should map SMO.LastName to ODB.BirthName when ODB.LegalName is null', async () => {
    const profileWithoutLegalName = {
      ...profileInfos,
      informations: {
        ...profileInfos.informations,
        legalName: null,
      },
    };

    const smoneyCreateUserRequest = new SmoneyCreateBankAccountMapper().fromDomain(profileWithoutLegalName);

    expect(smoneyCreateUserRequest.Profile.LastName).toEqual(profileWithoutLegalName.informations.birthName);
  });

  it('SmoneyCreateBankAccountMapper should map SMO.LastName to SMO.LegalName when ODB.LegalName is not null', async () => {
    const profileWithLegalName = {
      ...profileInfos,
      informations: {
        ...profileInfos.informations,
        legalName: 'test legalName',
      },
    };

    const smoneyCreateUserRequest = new SmoneyCreateBankAccountMapper().fromDomain(profileWithLegalName);

    expect(smoneyCreateUserRequest.Profile.LastName).toEqual(profileWithLegalName.informations.legalName);
  });
});

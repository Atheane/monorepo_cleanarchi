import {
  Address,
  BirthCountry,
  BirthDate,
  Consents,
  FiscalReference,
  HonorificCode,
  KYC,
  Profile,
  ProfileInformations,
  ProfileProperties,
} from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';
import { OneyTrustUpdateFolderMapper } from '../../adapters/mappers/OneyTrustUpdateFolderMapper';

describe('OneyTrustUpdateFolderMapper unti test', () => {
  it('should map Folder from Profile', () => {
    //Arrange
    const mapper = new OneyTrustUpdateFolderMapper();
    const profile = new Profile(profileProperties);

    //Act
    const result = mapper.fromDomain(profile);

    //Assert
    expect(result).toEqual({
      address: {
        country: 'FR',
        locality: 'Paris',
        postCode: '75019',
        streetName1: '2 Rue Gaston Rebuffat',
        streetName2: 'additional street',
      },
      birthDate: '1963-03-15',
      birthName: 'Itadori',
      caseReference: 'SP_2021212_beGe_flCm_frDNGY01Y',
      currency: 'EUR',
      familyName: 'Itadori',
      gender: 'M',
      givenNames: 'first name',
      income: {
        earningsAmountRange: 2845,
        fiscalCountry: 'FR',
      },
      professionalSituation: {
        professionalCategory: 'OBD_52',
      },
      nationality: 'FR',
      nativeCity: 'birth city',
      nativeCountry: 'FR',
    });
  });
});

const address = new Address({
  street: '2 Rue Gaston Rebuffat',
  additionalStreet: 'additional street',
  city: 'Paris',
  zipCode: '75019',
  country: 'FR',
});

const fiscalReference = new FiscalReference({
  country: 'FR',
});

const profileInformations: ProfileInformations = new ProfileInformations({
  status: ProfileStatus.ON_HOLD,
  honorificCode: HonorificCode.MALE,
  birthName: 'Itadori',
  legalName: 'Itadori',
  firstName: 'first name',
  birthDate: new BirthDate(new Date('1963-03-15 09:40:59.342Z')),
  birthCity: 'birth city',
  birthDepartmentCode: 'birth department code',
  birthDistrictCode: 'birth district code',
  birthCountry: new BirthCountry('FR'),
  nationalityCountryCode: 'FR',
  phone: '+33765511470',
  economicActivity: 52,
  earningsAmount: 2845,
  fiscalCountry: 'FR',
  address: address,
  fiscalReference: fiscalReference,
});

const profileProperties: ProfileProperties = {
  uid: 'beGe_flCm',
  email: 'mlamim263dev@mailsac.com',
  enabled: true,
  informations: profileInformations,
  kyc: { caseReference: 'SP_2021212_beGe_flCm_frDNGY01Y' } as KYC,
  digitalIdentityId: 'ZZjgUk_Ciqx-r1YIBEFrnHd7nRwp1zkXQmmwpPs88k2hotbq',
  documents: [],
  consents: {} as Consents,
};

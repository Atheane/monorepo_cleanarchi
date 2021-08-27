import { HonorificCode, ProfileInfos, ProfileStatus } from '@oney/profile-messages';

export const getProfileByIdMock = jest.fn(
  async (): Promise<ProfileInfos> => {
    return {
      email: '',
      enabled: false,
      kyc: { decision: undefined, documents: [], politicallyExposed: undefined, sanctioned: undefined },
      uid: '',
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
        status: ProfileStatus.ACTIVE,
        fiscalReference: null,
        birthDepartmentCode: '75',
        birthDistrictCode: '01',
      },
    };
  },
);

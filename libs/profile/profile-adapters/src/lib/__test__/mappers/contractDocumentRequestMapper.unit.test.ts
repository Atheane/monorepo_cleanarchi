import {
  BirthCountry,
  BirthDate,
  HonorificCode,
  KycDecisionType,
  Profile,
  Steps,
  FiscalReference,
  ContractDocumentRequest,
} from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';
import { ContractDocumentRequestMapper } from '../../adapters/mappers/ContractDocumentRequestMapper';

describe('ContractDocumentRequestMapper.unit.test', () => {
  const contractDocumentRequestMapper = new ContractDocumentRequestMapper();
  let profile: Profile;
  const userId = 'AWzclPFyN';

  beforeAll(async () => {
    profile = new Profile({
      uid: userId,
      email: 'nacimiphone8@yopmail.com',
      enabled: true,
      informations: {
        status: ProfileStatus.ON_BOARDING,
        honorificCode: HonorificCode.FEMALE,
        birthName: 'Mazen',
        legalName: 'Mazen',
        firstName: 'Mazendk',
        birthDate: new BirthDate(new Date('1996-11-07T00:00:00.000Z')),
        birthCity: 'Paris',
        birthDepartmentCode: '75',
        birthDistrictCode: '01',
        birthCountry: new BirthCountry('FR'),
        nationalityCountryCode: 'FR',
        phone: '+33633335552',
        economicActivity: 11,
        earningsAmount: 1,
        fiscalCountry: 'FR',
        address: {
          street: ' POUSTERLE DE PARIS',
          additionalStreet: 'appartement 00',
          city: 'AUCH',
          zipCode: '32000',
          country: 'FR',
        },
        fiscalReference: new FiscalReference({
          country: 'FR',
          fiscalNumber: 'azerty',
          establishmentDate: new Date('2020-11-07T00:00:00.000Z'),
        }),
      },
      kyc: {
        caseReference: userId,
        decision: KycDecisionType.OK,
        politicallyExposed: KycDecisionType.OK,
        sanctioned: KycDecisionType.OK,
        url: 'https://oneytrust.ot',
        steps: [
          Steps.PHONE_STEP,
          Steps.SELECT_OFFER_STEP,
          Steps.IDENTITY_DOCUMENT_STEP,
          Steps.FACEMATCH_STEP,
          Steps.ADDRESS_STEP,
          Steps.CIVIL_STATUS_STEP,
          Steps.FISCAL_STATUS_STEP,
          Steps.CONTRACT_STEP,
        ],
        contractSignedAt: new Date('2021-01-01'),
        amlReceived: false,
        eligibilityReceived: false,
        taxNoticeUploaded: null,
      },
      digitalIdentityId: 'digitalIdentityId',
      documents: [],
      consents: null,
    });
  });

  it('contractDocumentRequestMapper should return contractDocumentRequest', async () => {
    const fixtureContractDocumentRequest: ContractDocumentRequest = {
      uid: 'AWzclPFyN',
      honorificCode: HonorificCode.FEMALE,
      birthName: 'Mazen',
      legalName: 'Mazen',
      firstName: 'Mazendk',
      birthDate: new BirthDate(new Date('1996-11-07T00:00:00.000Z')),
      birthCountry: 'France',
      birthCity: 'Paris',
      nationalityCountryCode: 'France',
      street: ' POUSTERLE DE PARIS',
      zipCode: '32000',
      city: 'AUCH',
      country: 'France',
      phone: '+33633335552',
      email: 'nacimiphone8@yopmail.com',
      economicActivity: 'Agriculteurs sur petite exploitation',
      earningsAmount: 'Inférieurs à 1000 euros par mois',
      fiscalCountry: 'France',
      signatureDate: new Date('2021-01-01'),
      nif: 'azerty',
    };
    const contractDocumentRequest = contractDocumentRequestMapper.fromDomain(profile);
    expect(contractDocumentRequest).toEqual(fixtureContractDocumentRequest);
  });
});

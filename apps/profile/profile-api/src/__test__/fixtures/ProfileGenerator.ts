import { CoreTypes, WriteService } from '@oney/common-core';
import { ProfileMapper } from '@oney/profile-adapters';
import { HonorificCode, Profile, Steps } from '@oney/profile-core';
import { inject, injectable } from 'inversify';
import { ProfileStatus } from '@oney/profile-messages';

@injectable()
export class ProfileFacematchGenerator {
  private readonly _profileMapper = new ProfileMapper();

  constructor(@inject(CoreTypes.writeService) private readonly _writeService: WriteService) {}

  async generate(id: string, status: ProfileStatus): Promise<Profile> {
    const legacyProfile = await this._writeService.insert({
      id: id,
      user_profile: {
        status,
        phone: '+33633335552',
        birth_city: 'Paris',
        birth_country: 'FR',
        birth_department_code: '35',
        birth_district_code: '02',
        birth_date: new Date('1990-01-01'),
        birth_name: 'Mazen',
        first_name: 'Mazendk',
        honorific_code: HonorificCode.FEMALE,
        address: {
          street: ' POUSTERLE DE PARIS',
          additional_street: 'appartement 00',
          city: 'AUCH',
          zip_code: '32000',
          country: 'FR',
        },
        earnings_amount: 0.0,
        economic_activity: 11.0,
        fiscal_country: 'FR',
        nationality_country_code: 'FR',
        legal_name: 'Mazen',
        fiscal_reference: null,
      },
      kyc: {
        case_reference: 'SP_202118_xxvyxZTxt_cQ5JB6BqL',
        url:
          'https://pad-staging.api-ot.com/api/v2/static/dist/index.html?technicalId=5EF472956D887696676F8480F93602E0D95D4872EB1AE658D1C31871E702C134913C3EC624B6DAD57B01EF1EA69D3A972FADE6E54A4F4B78C8B303D1309AEA6F&token=vimJBwpF',
        steps: [
          Steps.PHONE_STEP,
          Steps.IDENTITY_DOCUMENT_STEP,
          Steps.FACEMATCH_STEP,
          Steps.ADDRESS_STEP,
          Steps.CIVIL_STATUS_STEP,
          Steps.FISCAL_STATUS_STEP,
          Steps.CONTRACT_STEP,
        ],
        contract_signed_at: new Date(),
        amlReceived: false,
        eligibilityReceived: false,
      },
      is_validated: true,
      biometric_key: null,
      can_bypass_oney_login: false,
      uid: id,
      email: 'nacimiphone8@yopmail.com',
      digital_identity: 'kTOzQe74xZy28yTXjrDjSYchhx_AU55wBqbJcBqxpK-SVqAt',
      oney_author_token: 'test',
      documents: [],
      consents: {
        oney: {
          cnil: false,
          len: null,
        },
        partners: {
          cnil: false,
          len: null,
        },
      },
    });

    return this._profileMapper.toDomain(legacyProfile);
  }
}

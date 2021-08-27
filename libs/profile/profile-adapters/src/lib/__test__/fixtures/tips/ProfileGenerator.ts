import { CoreTypes, WriteService } from '@oney/common-core';
import {
  DocumentType,
  HonorificCode,
  KycDecisionType,
  Profile,
  ProfileDocumentPartner,
  ProfileDocumentProps,
  Situation,
  Steps,
} from '@oney/profile-core';
import { inject, injectable } from 'inversify';
import { ProfileStatus } from '@oney/profile-messages';
import { ProfileMapper } from '../../../adapters/mappers/ProfileMapper';
import { MongodbProfile } from '../../../adapters/models/MongodbProfile';

// istanbul ignore next : only used to generate data for test
@injectable()
export class ProfileGenerator {
  private readonly _profileMapper = new ProfileMapper();

  constructor(@inject(CoreTypes.writeService) private readonly _writeService: WriteService) {}

  async generate(
    id: string,
    status: ProfileStatus,
    caseReference?: string,
    kycDecision?: KycDecisionType,
    email = 'nacimiphone8@yopmail.com',
    taxNoticeUploaded = false,
  ): Promise<Profile> {
    const legacyProfile = await this._writeService.updateOne<MongodbProfile>(id, {
      user_profile: {
        status,
        phone: '+33633335552',
        birth_city: 'Paris',
        birth_country: 'FR',
        birth_department_code: '75',
        birth_district_code: '01',
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
        earnings_amount: 1,
        economic_activity: 11.0,
        fiscal_country: 'FR',
        nationality_country_code: 'FR',
        legal_name: 'Mazen',
        fiscal_reference: {
          country: 'FR',
          fiscalNumber: 'azerty',
          establishmentDate: new Date('2020-11-07T00:00:00.000Z'),
        },
      },
      kyc: {
        case_reference: caseReference ? caseReference : id,
        decision: kycDecision ? kycDecision : KycDecisionType.OK,
        politicallyExposed: kycDecision ? kycDecision : KycDecisionType.OK,
        sanctioned: kycDecision ? kycDecision : KycDecisionType.OK,
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
        contract_signed_at: new Date('2021-01-01'),
        amlReceived: false,
        eligibilityReceived: false,
        taxNoticeUploaded: taxNoticeUploaded,
      },
      is_validated: true,
      biometric_key: null,
      can_bypass_oney_login: false,
      uid: id,
      email,
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

  async beforeContractStepSnapshot(id: string) {
    const profileProperties = this.getProfileProperties(id);
    profileProperties.kyc.steps = [Steps.CONTRACT_STEP];
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async beforeAddressStepSnapshot(id: string) {
    const profileProperties = this.getProfileProperties(id);
    profileProperties.user_profile.birth_country = 'FR';
    profileProperties.user_profile.birth_date = new Date('1990-01-01');
    profileProperties.kyc.steps = [
      Steps.ADDRESS_STEP,
      Steps.FACEMATCH_STEP,
      Steps.FISCAL_STATUS_STEP,
      Steps.CONTRACT_STEP,
    ];
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async beforeCivilStatusSnapshot(id: string, email?: string) {
    const profileProperties = this.getProfileProperties(id, email);
    profileProperties.user_profile.nationality_country_code = 'FR';
    profileProperties.kyc.steps = [
      Steps.CIVIL_STATUS_STEP,
      Steps.FACEMATCH_STEP,
      Steps.ADDRESS_STEP,
      Steps.FISCAL_STATUS_STEP,
      Steps.CONTRACT_STEP,
    ];
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async beforeIdentityDocumentStepSnapshot(id: string, caseReference?: string) {
    const profileProperties = this.getProfileProperties(id, undefined, caseReference);
    profileProperties.kyc.steps = [
      Steps.CIVIL_STATUS_STEP,
      Steps.FACEMATCH_STEP,
      Steps.ADDRESS_STEP,
      Steps.FISCAL_STATUS_STEP,
      Steps.CONTRACT_STEP,
      Steps.IDENTITY_DOCUMENT_STEP,
    ];
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async beforeTaxNoticeSnapshot(id: string, caseReference?: string) {
    const profileProperties = this.getProfileProperties(id, undefined, caseReference);
    profileProperties.user_profile.honorific_code = HonorificCode.FEMALE;
    profileProperties.user_profile.first_name = 'TestFirstName';
    profileProperties.user_profile.birth_name = 'TestLastName';
    profileProperties.user_profile.birth_date = new Date('1990-01-01');
    profileProperties.user_profile.nationality_country_code = 'FR';
    profileProperties.user_profile.birth_city = 'Paris';
    profileProperties.kyc.steps = [
      Steps.CIVIL_STATUS_STEP,
      Steps.FACEMATCH_STEP,
      Steps.ADDRESS_STEP,
      Steps.FISCAL_STATUS_STEP,
      Steps.CONTRACT_STEP,
      Steps.IDENTITY_DOCUMENT_STEP,
    ];
    profileProperties.kyc.decision = KycDecisionType.OK_MANUAL;
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async withTaxNoticeDocumentSnapshot(id: string, caseReference?: string) {
    const profileProperties = this.getProfileProperties(id, undefined, caseReference);
    profileProperties.kyc.steps = [
      Steps.CIVIL_STATUS_STEP,
      Steps.FACEMATCH_STEP,
      Steps.ADDRESS_STEP,
      Steps.FISCAL_STATUS_STEP,
      Steps.CONTRACT_STEP,
      Steps.IDENTITY_DOCUMENT_STEP,
    ];
    profileProperties.kyc.decision = KycDecisionType.OK_MANUAL;
    profileProperties.documents = [
      {
        uid: 'unique-id',
        type: DocumentType.ID_DOCUMENT,
        side: 'front',
        location: `${id}/kyc/id-front_1607558400000.jpg`,
        partner: ProfileDocumentPartner.ODB,
      } as ProfileDocumentProps,
      {
        uid: '58428',
        type: DocumentType.ID_DOCUMENT,
        side: 'front',
        location: `https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/${caseReference}/files`,
        partner: ProfileDocumentPartner.KYC,
      } as ProfileDocumentProps,
      {
        uid: 'unique-id',
        type: DocumentType.TAX_NOTICE,
        partner: ProfileDocumentPartner.ODB,
        location: 'MnDqtMQrm/kyc/tax_notice_1614729600000.jpg',
      } as ProfileDocumentProps,
      {
        uid: '59227',
        type: DocumentType.TAX_NOTICE,
        partner: ProfileDocumentPartner.KYC,
        location: `https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/${caseReference}/files`,
      } as ProfileDocumentProps,
    ];
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async cpompletedOnboardingSnapshot(id: string, email: string) {
    const profileProperties = this.getProfileProperties(id, email);
    profileProperties.kyc.steps = [];
    profileProperties.kyc.decision = KycDecisionType.OK_MANUAL;
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async withIdentityDocumentStepSnapshot(
    id: string,
    caseReference?: string,
    status: ProfileStatus = ProfileStatus.ON_BOARDING,
  ) {
    const profileProperties = this.getProfileProperties(id, undefined, caseReference);
    profileProperties.kyc.steps = [Steps.IDENTITY_DOCUMENT_STEP];
    profileProperties.user_profile.status = status;
    profileProperties.documents = [
      {
        uid: 'unique-id',
        type: DocumentType.ID_DOCUMENT,
        side: 'front',
        location: `${id}/kyc/id-front_1607558400000.jpg`,
        partner: ProfileDocumentPartner.ODB,
      } as ProfileDocumentProps,
      {
        uid: '58428',
        type: DocumentType.ID_DOCUMENT,
        side: 'front',
        location: `https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/${caseReference}/files`,
        partner: ProfileDocumentPartner.KYC,
      } as ProfileDocumentProps,
      {
        uid: 'unique-id',
        type: DocumentType.TAX_NOTICE,
        partner: ProfileDocumentPartner.ODB,
        location: 'MnDqtMQrm/kyc/tax_notice_1614729600000.jpg',
      } as ProfileDocumentProps,
      {
        uid: '59227',
        type: DocumentType.TAX_NOTICE,
        partner: ProfileDocumentPartner.KYC,
        location: `https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/${caseReference}/files`,
      } as ProfileDocumentProps,
    ];
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  private getProfileProperties(
    id: string,
    email = 'ozzj@yopmail.com',
    caseReference = 'SP_2021119__fMZo_lKM_h8LUZS2Wb',
  ) {
    return {
      user_profile: {
        status: ProfileStatus.ON_BOARDING,
        phone: '+33643455455',
        nationality_country_code: 'FR',
        address: {
          street: ' POUSTERLE DE PARIS',
          additional_street: 'appartement 00',
          city: 'AUCH',
          zip_code: '32000',
          country: 'FR',
        },
        fiscal_reference: {
          country: 'FR',
          fiscalNumber: 'azerty',
          establishmentDate: new Date('2020-11-07T00:00:00.000Z'),
        },
        birth_country: 'FR',
        earnings_amount: 1,
        economic_activity: 11.0,
      },
      kyc: {
        case_reference: caseReference,
        url:
          'https://pad-staging.api-ot.com/api/v2/static/dist/index.html?technicalId=19FB30ABFAF96749041028D7CB781CCDBCA79D1025943F380EA2E5E00E816D39EC9ACBA69D577F0B1F39C5C8FDB2CD890C45091FB08FBA2D019C2BBC8571352A&token=07084wQ0',
        steps: [],
      },
      is_validated: true,
      biometric_key: null,
      can_bypass_oney_login: false,
      uid: id,
      email: email,
      digital_identity: 'pX0Q2B_wBy12L8cVLgWnNVZsQD8GQIfudtWrWMCWxBBchwRq',
    } as MongodbProfile;
  }

  async getProfileWithConsent(id: string, email: string) {
    const profileProperties = this.getProfileProperties(id);
    profileProperties.email = email;
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async getProfileForBankAccountCreatedEvent(id: string) {
    const profileProperties = this.getProfileProperties(id);
    profileProperties.situation = {
      lead: false,
      staff: false,
      vip: false,
    };
    profileProperties.digital_identity = 'BIIMwjJcengyps7_ItaHuQqIZKsF6HTBknEH1hB-D3PyqZh4';
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async getProfileFemale(id: string) {
    const profileProperties = this.getProfileProperties(id);
    profileProperties.user_profile = {
      ...profileProperties.user_profile,
      honorific_code: HonorificCode.MALE,
      birth_date: new Date('1990-01-01'),
      birth_name: 'Mazen',
      first_name: 'Mazendk',
      legal_name: 'Mazen',
    };
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async afterContractStepSnapshot(id: string) {
    const profileProperties = this.getProfileProperties(id);
    profileProperties.user_profile = {
      status: ProfileStatus.ON_BOARDING,
      phone: '+33633335552',
      birth_city: 'Paris',
      birth_country: 'FR',
      birth_department_code: '75',
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
    };
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async setFirstNameToNull(id: string) {
    const profileProperties = this.getProfileProperties(id);
    profileProperties.user_profile = {
      ...profileProperties.user_profile,
      legal_name: 'Mazen',
      birth_name: 'Mazen',
      first_name: null,
      birth_department_code: '75',
      birth_district_code: '01',
      birth_city: 'Paris',
      birth_date: new Date('1990-01-01'),
      status: ProfileStatus.ON_BOARDING,
      phone: '+33643455455',
      address: {
        street: ' POUSTERLE DE PARIS',
        additional_street: 'appartement 00',
        city: 'AUCH',
        zip_code: '32000',
        country: 'FR',
      },
      birth_country: 'FR',
    };
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async addSituation(id: string, situation: Situation) {
    const profileProperties = this.getProfileProperties(id);
    profileProperties.situation = situation;
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async afterPhoneStep(id: string, phone: string) {
    const profileProperties = this.getProfileProperties(id);
    profileProperties.kyc.steps = [
      Steps.SELECT_OFFER_STEP,
      Steps.IDENTITY_DOCUMENT_STEP,
      Steps.FACEMATCH_STEP,
      Steps.ADDRESS_STEP,
      Steps.CIVIL_STATUS_STEP,
      Steps.FISCAL_STATUS_STEP,
      Steps.CONTRACT_STEP,
    ];

    profileProperties.user_profile = {
      ...profileProperties.user_profile,
      phone,
    };
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async beforePhoneStep(id: string) {
    const profileProperties = this.getProfileProperties(id);

    profileProperties.kyc.steps = [
      Steps.PHONE_STEP,
      Steps.SELECT_OFFER_STEP,
      Steps.IDENTITY_DOCUMENT_STEP,
      Steps.FACEMATCH_STEP,
      Steps.ADDRESS_STEP,
      Steps.CIVIL_STATUS_STEP,
      Steps.FISCAL_STATUS_STEP,
      Steps.CONTRACT_STEP,
    ];
    profileProperties.user_profile = {
      ...profileProperties.user_profile,
      phone: null,
    };
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async withPhoneNumber(id: string, phone: string) {
    const profileProperties = this.getProfileProperties(id);

    profileProperties.kyc.steps = [
      Steps.PHONE_STEP,
      Steps.SELECT_OFFER_STEP,
      Steps.IDENTITY_DOCUMENT_STEP,
      Steps.FACEMATCH_STEP,
      Steps.ADDRESS_STEP,
      Steps.CIVIL_STATUS_STEP,
      Steps.FISCAL_STATUS_STEP,
      Steps.CONTRACT_STEP,
    ];
    profileProperties.user_profile = {
      ...profileProperties.user_profile,
      phone,
    };
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }

  async addStepContract(id: string) {
    const profileProperties = this.getProfileProperties(id);
    profileProperties.kyc = {
      ...profileProperties.kyc,
      steps: [Steps.CONTRACT_STEP],
    };
    const profile = await this._writeService.updateOne<MongodbProfile>(id, profileProperties);
    return this._profileMapper.toDomain(profile);
  }
}

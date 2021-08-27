import { Mapper } from '@oney/common-core';
import {
  Address,
  BirthCountry,
  BirthDate,
  KYC,
  Profile,
  ProfileDocument,
  ProfileInformations,
} from '@oney/profile-core';
import { injectable } from 'inversify';
import { legacyKYC, MongodbProfile } from '../models/MongodbProfile';

@injectable()
export class ProfileMapper implements Mapper<Profile, MongodbProfile> {
  toDomain(raw: MongodbProfile): Profile {
    const { user_profile, kyc } = raw;
    return new Profile({
      enabled: raw.is_validated,
      uid: raw.uid,
      biometricKey: raw.biometric_key,
      digitalIdentityId: raw.digital_identity,
      email: raw.email,
      ...(raw.user_profile && {
        informations: new ProfileInformations({
          ...(raw.user_profile.address && {
            address: new Address({
              street: user_profile.address.street,
              additionalStreet: user_profile.address.additional_street,
              country: user_profile.address.country,
              city: user_profile.address.city,
              zipCode: user_profile.address.zip_code,
            }),
          }),
          birthCity: user_profile.birth_city,
          birthDepartmentCode: user_profile.birth_department_code,
          birthDistrictCode: user_profile.birth_district_code,
          ...(user_profile.birth_country && {
            birthCountry: new BirthCountry(user_profile.birth_country),
          }),
          ...(user_profile.birth_date && {
            birthDate: new BirthDate(user_profile.birth_date),
          }),
          birthName: user_profile.birth_name,
          earningsAmount: user_profile.earnings_amount,
          economicActivity: user_profile.economic_activity,
          firstName: user_profile.first_name,
          fiscalCountry: user_profile.fiscal_country,
          honorificCode: user_profile.honorific_code,
          legalName: user_profile.legal_name,
          nationalityCountryCode: user_profile.nationality_country_code,
          phone: user_profile.phone,
          status: user_profile.status,
          fiscalReference: user_profile.fiscal_reference,
        }),
      }),
      ...(raw.kyc && {
        kyc: new KYC({
          caseReference: kyc.case_reference,
          contractSignedAt: kyc.contract_signed_at,
          steps: kyc.steps,
          url: kyc.url,
          caseId: kyc.caseId,
          sanctioned: kyc.sanctioned,
          compliance: kyc.compliance,
          politicallyExposed: kyc.politicallyExposed,
          fraud: kyc.fraud,
          decision: kyc.decision,
          decisionScore: kyc.decisionScore,
          moneyLaunderingRisk: kyc.moneyLaunderingRisk,
          eligibility: kyc.eligibility,
          amlReceived: kyc.amlReceived,
          eligibilityReceived: kyc.eligibilityReceived,
          existingIdentity: kyc.existingIdentity,
          taxNoticeUploaded: kyc.taxNoticeUploaded,
          ...(kyc.versions && {
            versions: kyc.versions.map(
              item =>
                new KYC({
                  caseReference: item.case_reference,
                  contractSignedAt: item.contract_signed_at,
                  steps: item.steps,
                  url: item.url,
                  caseId: item.caseId,
                  sanctioned: item.sanctioned,
                  compliance: item.compliance,
                  politicallyExposed: item.politicallyExposed,
                  fraud: item.fraud,
                  decision: item.decision,
                  decisionScore: item.decisionScore,
                  moneyLaunderingRisk: item.moneyLaunderingRisk,
                  eligibility: item.eligibility,
                  amlReceived: item.amlReceived,
                  eligibilityReceived: item.eligibilityReceived,
                  existingIdentity: item.existingIdentity,
                  taxNoticeUploaded: item.taxNoticeUploaded,
                }),
            ),
          }),
        }),
      }),
      documents: raw.documents?.map(documentProps => new ProfileDocument(documentProps)) || [],
      situation: raw.situation,
      consents: raw.consents || {
        partners: {
          cnil: false,
          len: null,
        },
        oney: {
          cnil: false,
          len: null,
        },
      },
    });
  }

  fromDomain(raw: Profile): MongodbProfile {
    const legacyProfile: MongodbProfile = {
      uid: raw.props.uid,
      email: raw.props.email,
      ...(raw.props.informations && {
        user_profile: {
          birth_city: raw.props.informations.birthCity,
          birth_department_code: raw.props.informations.birthDepartmentCode,
          birth_district_code: raw.props.informations.birthDistrictCode,
          ...(raw.props.informations.birthCountry && {
            birth_country: raw.props.informations.birthCountry.value,
          }),
          ...(raw.props.informations.birthDate && {
            birth_date: raw.props.informations.birthDate,
          }),
          birth_name: raw.props.informations.birthName,
          legal_name: raw.props.informations.legalName,
          first_name: raw.props.informations.firstName,
          earnings_amount: raw.props.informations.earningsAmount,
          economic_activity: raw.props.informations.economicActivity,
          fiscal_country: raw.props.informations.fiscalCountry,
          honorific_code: raw.props.informations.honorificCode,
          nationality_country_code: raw.props.informations.nationalityCountryCode,
          status: raw.props.informations.status,
          fiscal_reference: raw.props.informations.fiscalReference,
          phone: raw.props.informations.phone,
          ...(raw.props.informations.address && {
            address: {
              country: raw.props.informations.address.country,
              city: raw.props.informations.address.city,
              street: raw.props.informations.address.street,
              additional_street: raw.props.informations.address.additionalStreet,
              zip_code: raw.props.informations.address.zipCode,
            },
          }),
        },
      }),
      ...(raw.props.kyc && {
        kyc: {
          case_reference: raw.props.kyc.caseReference,
          contract_signed_at: raw.props.kyc.contractSignedAt,
          url: raw.props.kyc.url,
          steps: raw.props.kyc.steps,
          decision: raw.props.kyc.decision,
          decisionScore: raw.props.kyc.decisionScore,
          fraud: raw.props.kyc.fraud,
          politicallyExposed: raw.props.kyc.politicallyExposed,
          sanctioned: raw.props.kyc.sanctioned,
          compliance: raw.props.kyc.compliance,
          caseId: raw.props.kyc.caseId,
          moneyLaunderingRisk: raw.props.kyc.moneyLaunderingRisk,
          eligibility: raw.props.kyc.eligibility,
          amlReceived: raw.props.kyc.amlReceived,
          eligibilityReceived: raw.props.kyc.eligibilityReceived,
          existingIdentity: raw.props.kyc.existingIdentity,
          taxNoticeUploaded: raw.props.kyc.taxNoticeUploaded,
          ...(raw.props.kyc.versions && {
            versions: raw.props.kyc.versions.map(item => {
              return {
                case_reference: item.caseReference,
                contract_signed_at: item.contractSignedAt,
                url: raw.props.kyc.url,
                steps: raw.props.kyc.steps,
                decision: raw.props.kyc.decision,
                decisionScore: raw.props.kyc.decisionScore,
                fraud: raw.props.kyc.fraud,
                politicallyExposed: raw.props.kyc.politicallyExposed,
                sanctioned: raw.props.kyc.sanctioned,
                compliance: raw.props.kyc.compliance,
                caseId: raw.props.kyc.caseId,
                moneyLaunderingRisk: raw.props.kyc.moneyLaunderingRisk,
                eligibility: raw.props.kyc.eligibility,
                amlReceived: raw.props.kyc.amlReceived,
                eligibilityReceived: raw.props.kyc.eligibilityReceived,
                existingIdentity: raw.props.kyc.existingIdentity,
                taxNoticeUploaded: raw.props.kyc.taxNoticeUploaded,
              } as legacyKYC;
            }),
          }),
        },
      }),
      is_validated: raw.props.enabled,
      can_bypass_oney_login: false,
      digital_identity: raw.props.digitalIdentityId,
      oney_author_token: '',
      biometric_key: raw.props.biometricKey,
      ...(raw.props.documents && {
        documents: raw.props.documents.map(document => document.props),
      }),
      situation: raw.props.situation,
      consents: raw.props.consents || {
        partners: {
          cnil: false,
          len: null,
        },
        oney: {
          cnil: false,
          len: null,
        },
      },
    };

    return legacyProfile;
  }
}

import { Mapper } from '@oney/common-core';
import { Profile } from '@oney/profile-core';
import { injectable } from 'inversify';
import { PublicProfile } from './types/PublicProfile';

@injectable()
export class ProfileMapper implements Mapper<Profile, PublicProfile> {
  fromDomain(profile: Profile): PublicProfile {
    return {
      uid: profile.props.uid,
      email: profile.props.email,
      biometric_key: profile.props.biometricKey,
      is_validated: profile.props.enabled,
      ...(profile.props.informations && {
        profile: {
          ...(profile.props.informations.address && {
            address: {
              street: profile.props.informations.address.street,
              additional_street: profile.props.informations.address.additionalStreet,
              country: profile.props.informations.address.country,
              city: profile.props.informations.address.city,
              zip_code: profile.props.informations.address.zipCode,
            },
          }),
          status: profile.props.informations.status,
          phone: profile.props.informations.phone,
          birth_city: profile.props.informations.birthCity,
          birth_department_code: profile.props.informations.birthDepartmentCode,
          birth_district_code: profile.props.informations.birthDistrictCode,
          ...(profile.props.informations.birthCountry && {
            birth_country: profile.props.informations.birthCountry.value,
          }),
          ...(profile.props.informations.birthDate && {
            birth_date: profile.props.informations.birthDate,
          }),
          birth_name: profile.props.informations.birthName,
          first_name: profile.props.informations.firstName,
          honorific_code: profile.props.informations.honorificCode,
          earnings_amount: profile.props.informations.earningsAmount,
          economic_activity: profile.props.informations.economicActivity,
          fiscal_country: profile.props.informations.fiscalCountry,
          legal_name: profile.props.informations.legalName,
          nationality: profile.props.informations.nationalityCountryCode,
        },
      }),
      ...(profile.props.kyc && {
        steps: profile.props.kyc.steps,
        facematch_url: profile.props.kyc.url,
        ...(profile.props.kyc.decision && {
          kyc: {
            decision: profile.props.kyc.decision,
            ...(profile.props.kyc.politicallyExposed && {
              politicallyExposed: profile.props.kyc.politicallyExposed,
            }),
            ...(profile.props.kyc.sanctioned && {
              sanctioned: profile.props.kyc.sanctioned,
            }),
          },
        }),
      }),
      contract_signed_at: profile.props.kyc.contractSignedAt,
      ...(profile.props.documents && {
        documents: profile.props.documents.map(document => document.props),
      }),
      consents: profile.props.consents,
    };
  }
}

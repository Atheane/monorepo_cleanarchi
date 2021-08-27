import { Mapper } from '@oney/common-core';
import { Profile } from '@oney/profile-core';
import { injectable } from 'inversify';
import { parsePhoneNumber, PhoneNumber } from 'libphonenumber-js';
import * as moment from 'moment';
import { CreateCustomerRequest } from '../providers/oneyB2C/models/CreateCustomerRequest';

@injectable()
export class OneyB2CCustomerMapper implements Mapper<Profile> {
  fromDomain(profile: Profile): CreateCustomerRequest {
    const phone: PhoneNumber = parsePhoneNumber(profile.props.informations.phone, 'FR');
    return {
      birth_municipality: profile.props.informations.birthCity,
      ...(profile.props.informations.address && {
        adresses: [
          {
            country_code: profile.props.informations.address.country,
            line1: profile.props.informations.address.street,
            line2: profile.props.informations.address.additionalStreet,
            municipality: profile.props.informations.address.city,
            postal_code: profile.props.informations.address.zipCode,
            type_code: 'HOME',
          },
        ],
      }),
      ...(profile.props.informations.birthDate && {
        birth_date: moment(profile.props.informations.birthDate).format('YYYY-MM-DD'),
      }),
      ...(profile.props.informations.phone && {
        phones: [
          {
            number: `0${phone.nationalNumber}`,
            type_code: 'MPRS',
            country_dialing_code: `+${phone.countryCallingCode}`,
          },
        ],
      }),
      person_ids: [
        {
          application_code: 'BQ_DIGIT',
          application_person_id_field: 'SID',
          application_person_id: profile.props.uid,
        },
      ],
      emails: [
        {
          address: profile.props.email,
          type_code: 'PRS',
        },
      ],
      birth_name: profile.props.informations.birthName,
      ...(profile.props.informations.legalName && {
        married_name: profile.props.informations.legalName,
      }),
      honorific_code: profile.props.informations.honorificCode,
      first_name: profile.props.informations.firstName,
      birth_country: profile.getBirthCountry(),
      birth_country_code: profile.props.informations.birthCountry
        ? profile.props.informations.birthCountry.value
        : null,
      ...(profile.props.informations.birthDepartmentCode && {
        birth_departement_code: profile.props.informations.birthDepartmentCode,
      }),
      ...(profile.props.informations.birthDistrictCode && {
        birth_district_code: profile.props.informations.birthDistrictCode,
      }),
      cnil_oney_flag: profile.props.consents.oney.cnil ? '0' : '1',
      cnil_partner_flag: profile.props.consents.partners.cnil ? '0' : '1',
      len_oney_flag:
        profile.props.consents.oney.len === null || profile.props.consents.oney.len === undefined
          ? undefined
          : (+!profile.props.consents.oney.len).toString(),
      len_partner_flag:
        profile.props.consents.partners.len === null || profile.props.consents.partners.len === undefined
          ? undefined
          : (+!profile.props.consents.partners.len).toString(),
    };
  }
}

import { Mapper } from '@oney/common-core';
import { Profile } from '@oney/profile-core';
import { injectable } from 'inversify';
import * as moment from 'moment';
import { GetFicpRequestIdCommand } from '../providers/OneyFicp/models/FicpModels';

@injectable()
export class OneyFicpMapper
  implements Mapper<{ profile: Profile; partner_guid: string }, GetFicpRequestIdCommand> {
  fromDomain(raw: { profile: Profile; partner_guid: string }): GetFicpRequestIdCommand {
    return {
      partner_guid: raw.partner_guid,
      encrypted_message: {
        birth_name: raw.profile.props.informations.birthName?.toUpperCase(),
        first_name: raw.profile.props.informations.firstName?.toUpperCase(),
        birth_country_code: raw.profile.props.informations.birthCountry.value,
        birth_department_code: raw.profile.props.informations.birthDepartmentCode,
        birth_district_code: raw.profile.props.informations.birthDistrictCode,
        birth_municipality: raw.profile.props.informations.birthCity,
        birth_date: moment(raw.profile.props.informations.birthDate).format('YYYY-MM-DD'),
        married_name: raw.profile.props.informations.legalName
          ? raw.profile.props.informations.legalName?.toUpperCase()
          : '',
        person_ids: {
          application_code: 'BQ_DIGIT',
          application_person_id: raw.profile.props.uid,
          application_person_id_field: 'SID',
        },
        external_reference_code: raw.profile.props.kyc.caseReference,
        external_reference_type: 'BQ_DIGIT_PROPOSAL',
        request_cause_code: 'BQ_DIGIT',
      },
    };
  }
}

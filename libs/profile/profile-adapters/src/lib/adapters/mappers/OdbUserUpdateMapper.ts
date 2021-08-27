import { Mapper } from '@oney/common-core';
import { Profile } from '@oney/profile-core';
import { injectable } from 'inversify';
import { UpdateUserRequest } from '../providers/odb/payment/models/updateUser/UpdateUserRequest';

@injectable()
export class OdbUserUpdateMapper implements Mapper<Profile, UpdateUserRequest> {
  fromDomain(profile: Profile): UpdateUserRequest {
    return {
      uid: profile.props.uid,
      phone: profile.props.informations.phone,
      fiscalReference: profile.props.informations.fiscalReference,
      declarativeFiscalSituation: {
        income: profile.props.informations.earningsAmount.toString(),
        economicActivity: profile.props.informations.economicActivity.toString(),
      },
    };
  }
}

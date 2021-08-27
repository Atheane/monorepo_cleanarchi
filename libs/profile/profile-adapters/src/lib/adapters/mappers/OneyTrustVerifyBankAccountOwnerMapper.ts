import { Mapper } from '@oney/common-core';
import { BankAccountIdentityRequest, HonorificCode } from '@oney/profile-core';
import * as moment from 'moment';
import { ShortIdGenerator } from '@oney/profile-adapters';
import {
  OneytrustEventChannel,
  OneyTrustEventGender,
  OneytrustEventLabel,
  OneyTrustEventRequest,
  OneytrustEventType,
} from '../providers/oneytrust/models/caseApi/OneyTrustEventRequest';

export class OneyTrustVerifyBankAccountOwnerMapper
  implements Mapper<BankAccountIdentityRequest, OneyTrustEventRequest> {
  fromDomain(request: BankAccountIdentityRequest): OneyTrustEventRequest {
    let gender: OneyTrustEventGender;
    switch (request.identity.profileInformation.honorificCode) {
      case HonorificCode.MALE:
        gender = OneyTrustEventGender.MALE;
        break;
      case HonorificCode.FEMALE:
        gender = OneyTrustEventGender.FEMALE;
        break;
    }

    const masterReference = request.uid;
    const now = new Date();
    const uniqId = new ShortIdGenerator().generateUniqueID();
    const eventReference = `EVENT_${now.getFullYear()}${
      now.getMonth() + 1
    }${now.getDate()}_${masterReference}_${uniqId}`;

    return {
      eventReference,
      eventType: OneytrustEventType.DATAMATCHING,
      eventLabel: OneytrustEventLabel.DATAMATCHING,
      eventChannel: OneytrustEventChannel.APP,
      masterReference,
      data: {
        gender,
        familyName: request.identity.profileInformation.legalName,
        birthName: request.identity.profileInformation.birthName,
        givenNames: request.identity.profileInformation.firstName,
        birthDate: moment(request.identity.profileInformation.birthDate).format('YYYY-MM-DD'),
        pfm: {
          ...(request.identity.bankAccountIdentity.identity && {
            identity: request.identity.bankAccountIdentity.identity,
          }),
          ...(request.identity.bankAccountIdentity.lastName && {
            familyName: request.identity.bankAccountIdentity.lastName,
          }),
          ...(request.identity.bankAccountIdentity.firstName && {
            givenName: request.identity.bankAccountIdentity.firstName,
          }),
          ...(request.identity.bankAccountIdentity.birthDate && {
            birthDate: moment(request.identity.bankAccountIdentity.birthDate).format('YYYY-MM-DD'),
          }),
          bank: request.identity.bankAccountIdentity.bankName,
        },
      },
    };
  }
}

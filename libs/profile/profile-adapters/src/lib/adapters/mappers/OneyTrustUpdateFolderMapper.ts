import { Mapper } from '@oney/common-core';
import { HonorificCode, Profile, ProfileInformations } from '@oney/profile-core';
import { injectable } from 'inversify';
import * as moment from 'moment';
import {
  Address,
  Income,
  OneyTrustGender,
  UpdateOneyTrustCaseRequest,
} from '../providers/oneytrust/models/caseApi/UpdateOneyTrustCaseRequest';

@injectable()
export class OneyTrustUpdateFolderMapper implements Mapper<Profile, UpdateOneyTrustCaseRequest> {
  private convertHonorificCodeToOneyTrustGender(honorificCode: string): OneyTrustGender {
    switch (honorificCode) {
      case HonorificCode.MALE:
        return OneyTrustGender.MALE;
      case HonorificCode.FEMALE:
        return OneyTrustGender.FEMALE;
      default:
        return OneyTrustGender.OTHER;
    }
  }

  fromDomain(profile: Profile): UpdateOneyTrustCaseRequest {
    return {
      address: this.mapAddress(profile.props.informations.address),
      birthDate: moment(new Date(profile.props.informations.birthDate)).format('YYYY-MM-DD'),
      givenNames: profile.props.informations.firstName,
      ...(profile.props.informations.legalName && {
        familyName: profile.props.informations.legalName,
      }),
      birthName: profile.props.informations.birthName,
      gender: this.convertHonorificCodeToOneyTrustGender(profile.props.informations.honorificCode),
      caseReference: profile.props.kyc.caseReference,
      currency: 'EUR',
      ...(profile.props.informations.earningsAmount && {
        income: this.mapIncome(profile.props.informations),
      }),
      professionalSituation: { professionalCategory: 'OBD_' + profile.props.informations.economicActivity },
      nationality: profile.props.informations.nationalityCountryCode,
      nativeCity: profile.props.informations.birthCity,
      nativeCountry: profile.props.informations.birthCountry.value,
      ...(profile.props.ipAddress && { ipAddress: profile.props.ipAddress.trim() }),
    };
  }

  private mapAddress(address): Address | {} {
    return address
      ? {
          locality: address.city,
          postCode: address.zipCode,
          streetName1: address.street,
          streetName2: address.additionalStreet ? address.additionalStreet : null,
          country: address.country,
        }
      : {};
  }

  private mapIncome(informations: ProfileInformations): Income {
    return {
      earningsAmountRange: informations.earningsAmount,
      fiscalCountry: informations.fiscalReference.country,
    };
  }
}

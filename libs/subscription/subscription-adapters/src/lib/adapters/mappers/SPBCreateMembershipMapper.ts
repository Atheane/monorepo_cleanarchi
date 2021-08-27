import { Mapper } from '@oney/common-core';
import { InsuranceErrors, CreateInsuranceMembershipRequest } from '@oney/subscription-core';
import { OfferType } from '@oney/subscription-messages';
import { HonorificCode } from '@oney/profile-messages';
import * as moment from 'moment';
import { SPBCreateMembershipRequest } from '../partners/spb/models/membership/SPBCreateMembershipRequest';
import { CustomerTitle } from '../partners/spb/models/types/CustomerTitle';
import { SpbOfferTypes } from '../partners/spb/models/types/SpbOfferTypes';
import { AddressType } from '../partners/spb/models/types/AddressType';
import { AddressNature } from '../partners/spb/models/types/AddressNature';
import { BankRole } from '../partners/spb/models/types/BankRole';

export class SPBCreateMembershipMapper
  implements Mapper<CreateInsuranceMembershipRequest, SPBCreateMembershipRequest> {
  constructor(private readonly _bin8MissingChar: string) {}
  fromDomain(t: CreateInsuranceMembershipRequest): SPBCreateMembershipRequest {
    const offerUID = SPBCreateMembershipMapper._getSPBOfferUid(t.offerType);
    const customerTitle = SPBCreateMembershipMapper._getSPBCustomerTitle(t.profileInfo.honorificCode);
    const bin8Pan = this._getBIN8FromHiddenPan(t.creditCardInfo.pan);
    return {
      offerUIDs: [offerUID],
      customer: {
        title: customerTitle,
        firstName: t.profileInfo.firstName,
        lastName: t.profileInfo.legalName,
        birthdate: moment(t.profileInfo.birthDate).format('YYYY-MM-DD'),
        email: t.profileInfo.email,
        mobileNumber: t.profileInfo.phone,
        address: {
          addressType: AddressType.STREET,
          addressNature: AddressNature.MAIN,
          iso2country: t.profileInfo.address.country,
          correspondence: false,
          city: t.profileInfo.address.city,
          zipCode: t.profileInfo.address.zipCode,
          address: t.profileInfo.address.street,
          ...(t.profileInfo.address.additionalStreet && {
            additionalAddress: t.profileInfo.address.additionalStreet,
          }),
        },
        bankingInfo: {
          bankAccountHolder: `${customerTitle} ${t.profileInfo.legalName} ${t.profileInfo.firstName}`,
          iban: t.bankAccountInfo.iban,
          bic: t.bankAccountInfo.bic,
          bankCard: {
            pan: bin8Pan,
          },
          role: BankRole.SUBSCRIBER,
        },
      },
    };
  }

  private static _getSPBOfferUid(domainOfferId: OfferType): SpbOfferTypes {
    switch (domainOfferId) {
      case OfferType.ONEY_ORIGINAL:
        return SpbOfferTypes.ONEYBDCLASSIC_001;
      case OfferType.ONEY_FIRST:
        return SpbOfferTypes.ONEYBDPREMIER_001;
      default:
        throw new InsuranceErrors.OfferNotAvailable('Offer is not available');
    }
  }

  private static _getSPBCustomerTitle(honorificCode: HonorificCode): CustomerTitle {
    switch (honorificCode) {
      case HonorificCode.MALE:
        return CustomerTitle.MR;
      case HonorificCode.FEMALE:
        return CustomerTitle.MRS;
      default:
        throw new InsuranceErrors.HonorificCodeNotHandle('Honorific code is not managed');
    }
  }

  private _getBIN8FromHiddenPan(hiddenPan: string): string {
    return `${hiddenPan.slice(0, 4)}${this._bin8MissingChar}xxxx${hiddenPan.slice(
      hiddenPan.length - 4,
      hiddenPan.length,
    )}`;
  }
}

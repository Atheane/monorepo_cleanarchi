import { Mapper } from '@oney/common-core';
import { KycFilters } from '@oney/payment-core';
import { KycDecisionType } from '@oney/profile-messages';
import { SmoneyKycFiltersRequest } from '../partners/smoney/models/kyc/SmoneyKycFiltersRequest';

export class SmoneyKycFiltersMapper implements Mapper<KycFilters, SmoneyKycFiltersRequest> {
  fromDomain(kyc: KycFilters): SmoneyKycFiltersRequest {
    const applyMoneyLaunderingFilter = [KycDecisionType.OK_MANUAL, KycDecisionType.KO_MANUAL];
    const politicallyExposed = applyMoneyLaunderingFilter.includes(kyc.kycValues.politicallyExposed);
    const sanctioned = applyMoneyLaunderingFilter.includes(kyc.kycValues.sanctioned);

    return {
      uid: kyc.uid,
      PPE: politicallyExposed,
      Sanction: sanctioned,
      FCC: null,
    } as SmoneyKycFiltersRequest;
  }
}

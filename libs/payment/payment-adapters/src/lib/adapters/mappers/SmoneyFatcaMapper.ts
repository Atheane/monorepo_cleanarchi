import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { FiscalReference } from '@oney/profile-messages';
import { SmoneyFatcaRequest } from '../partners/smoney/models/fatca/SmoneyFatcaRequest';

@injectable()
export class SmoneyFatcaMapper implements Mapper<FiscalReference, SmoneyFatcaRequest> {
  fromDomain(fiscalReference: FiscalReference): SmoneyFatcaRequest {
    // Smoney does not handle several fiscal countries yet, so we use only the first one
    return {
      Americanness: false,
      TaxCountry: fiscalReference.country,
      TIN: fiscalReference.fiscalNumber,
    };
  }
}

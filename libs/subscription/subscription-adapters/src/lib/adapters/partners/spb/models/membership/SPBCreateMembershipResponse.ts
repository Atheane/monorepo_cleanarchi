import { SpbOfferTypes } from '../types/SpbOfferTypes';
import { Customer } from '../types/Customer';

export interface SPBCreateMembershipResponse {
  number: string;
  productCode: number;
  productGroupCode: string;
  offerCodes: SpbOfferTypes;
  subscriptionDate: Date;
  coversEffectiveDate: string;
  subscriber: Customer;
  status: string;
}

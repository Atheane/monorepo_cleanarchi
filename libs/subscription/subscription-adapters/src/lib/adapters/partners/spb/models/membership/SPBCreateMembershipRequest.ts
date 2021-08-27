import { SpbOfferTypes } from '../types/SpbOfferTypes';
import { Customer } from '../types/Customer';

export interface SPBCreateMembershipRequest {
  offerUIDs: SpbOfferTypes[];
  customer: Customer;
}

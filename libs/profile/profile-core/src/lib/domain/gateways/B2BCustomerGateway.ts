import { CustomerSituations } from '../valuesObjects/CustomerSituations';

export interface B2BCustomerGateway {
  getCustomerSituations(digitalIdentityId: string): Promise<CustomerSituations>;
}

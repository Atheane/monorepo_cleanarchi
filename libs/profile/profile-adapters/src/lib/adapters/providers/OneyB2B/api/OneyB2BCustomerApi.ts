import { IHttpBuilder } from '@oney/http';
import { CustomerSituationsResponse } from '../models/CustomerSituationsResponse';

export class OneyB2BCustomerApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async getCustomerSituations(uid: string): Promise<CustomerSituationsResponse> {
    const queryParameters = new URLSearchParams();
    queryParameters.append('person_ids.application_person_id', uid);
    queryParameters.append('person_ids.application_code', 'BQ_DIGIT');
    queryParameters.append('person_ids.application_person_id_field', 'SID');
    queryParameters.append('fields', 'internal_incidents,credit_accounts_situation');

    const { data } = await this._http
      .get<CustomerSituationsResponse>(`/b2b/customers/v2/customer_situations`, queryParameters)
      .execute();
    return data;
  }
}

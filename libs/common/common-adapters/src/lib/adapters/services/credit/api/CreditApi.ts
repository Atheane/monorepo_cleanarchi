import { IHttpBuilder } from '@oney/http';
import { GetSplitContractsRequest } from '../models/GetSplitContractsRequest';
import { GetSplitContractsResponse } from '../models/GetSplitContractsResponse';
import { GetUserDetailsRequest } from '../models/GetUserDetails.Request';

export class CreditApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async getSplitContracts(request: GetSplitContractsRequest): Promise<GetSplitContractsResponse[]> {
    const result = await this._http
      .setDefaultHeaders({
        Authorization: `Bearer ${request.holder}`,
      })
      .get<GetSplitContractsResponse[]>(`/credit/users/${request.uid}/details`)
      .execute();
    return result.data;
  }

  async getUserDetails(request: GetUserDetailsRequest): Promise<GetSplitContractsResponse[]> {
    const result = await this._http
      .get<GetSplitContractsResponse[]>(`/credit/users/${request.uid}/details`)
      .execute();
    return result.data;
  }
}

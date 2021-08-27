import { IHttpBuilder } from '@oney/http';
import { SmoneyAllowanceRequest } from '../models/allowance/SmoneyAllowanceRequest';
import { SmoneyAllowanceResponse } from '../models/allowance/SmoneyAllowanceResponse';

export class SmoneyAllowanceApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async getLimits(userRequest: SmoneyAllowanceRequest): Promise<SmoneyAllowanceResponse> {
    const { data } = await this._http
      .get<SmoneyAllowanceResponse>(`users/${userRequest.appUserId}/limits`)
      .execute();
    return data;
  }
}

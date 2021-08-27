import { IHttpBuilder } from '@oney/http';
import { SmoneyBankAccountDetailRequest } from '../models/bankAccount/smoneyBankAccountDetailRequest';
import { SmoneyBankAccountDetailResponse } from '../models/bankAccount/smoneyBankAccountDetailResponse';

export class SmoneyBankAccountApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async getBankAccountDetail(
    request: SmoneyBankAccountDetailRequest,
  ): Promise<SmoneyBankAccountDetailResponse> {
    const { data } = await this._http
      .get<SmoneyBankAccountDetailResponse>(`users/${request.smoneyId}/bankaccounts/${request.bankAccountId}`)
      .execute();
    return data;
  }
}

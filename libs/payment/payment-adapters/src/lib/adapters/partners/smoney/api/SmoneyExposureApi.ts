import { IHttpBuilder } from '@oney/http';

export interface SmoneyExposureRequest {
  userId: string;
  amount: number;
}

export class SmoneyExposureApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async updateExposure(appUserId: string, amount: number): Promise<void> {
    const url = `users/${appUserId}/additionalBalance`;
    const body = { AdditionalBalanceAmount: amount };
    const { data } = await this._http.put<void>(url, body).execute();
    return data;
  }
}

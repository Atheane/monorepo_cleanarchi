import { IHttpBuilder } from '@oney/http';
import { SmoneyPaymentRequest } from '../models/payment/SmoneyPaymentRequest';
import { SmoneyPaymentResponse } from '../models/payment/SmoneyPaymentResponse';

export class SmoneyPaymentApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async createPayment(paymentRequest: SmoneyPaymentRequest): Promise<SmoneyPaymentResponse> {
    const { data } = await this._http
      .post<SmoneyPaymentResponse>(`users/${paymentRequest.sender.appaccountid}/payments`, paymentRequest)
      .execute();
    return data;
  }
}

import { IHttpBuilder } from '@oney/http';
import { SmoneyTransferRequest } from '../models/transfer/SmoneyTransferRequest';
import { SmoneyTransferResponse } from '../models/transfer/SmoneyTransferResponse';

export class SmoneyTransferApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async makeTransfer(transferRequest: SmoneyTransferRequest): Promise<SmoneyTransferResponse> {
    const { data } = await this._http
      .post<SmoneyTransferResponse>(`users/${transferRequest.Accountid.AppAccountId}/sct`, transferRequest)
      .execute();
    return data;
  }
}

import { IHttpBuilder } from '@oney/http';
import { GetAllTransactionRequest } from '../models/GetAllTransactionRequest';

export class PfmApi {
  constructor(private readonly _http: IHttpBuilder) {}

  getAllTransaction(request: GetAllTransactionRequest): Promise<any> {
    return this._http
      .setDefaultHeaders({
        Authorization: `Bearer ${request.holder}`,
      })
      .get(`/pfm/users/${request.uid}/transactions`, request.query)
      .execute();
  }
}

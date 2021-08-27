import { IHttpBuilder } from '@oney/http';
import { SmoneyCardEncryptedPanRequest } from '../models/card/SmoneyCardEncryptedPanRequest';
import { SmoneyCardEncryptedPanResponse } from '../models/card/SmoneyCardEncryptedPanResponse';

export class SmoneyCardApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async getEncryptedPan(request: SmoneyCardEncryptedPanRequest): Promise<SmoneyCardEncryptedPanResponse> {
    const { data } = await this._http
      .post<SmoneyCardEncryptedPanResponse>(`/cards/${request.cardId}/display`, {
        RSAPublicKey: request.RSAKey,
      })
      .execute();
    return data;
  }
}

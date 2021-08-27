import { IHttpBuilder } from '@oney/http';
import { SmoneyCreateCardRequest } from '../models/card/createCard/SmoneyCreateCardRequest';
import { SmoneyCreateCardResponse } from '../models/card/createCard/SmoneyCreateCardResponse';
import { SmoneyUpdateCardRequest } from '../models/card/updateCard/SmoneyUpdateCardRequest';
import { SmoneyUpdateCardResponse } from '../models/card/updateCard/SmoneyUpdateCardResponse';
import { SmoneyCardDisplayRequest } from '../models/card/cardDisplay/SmoneyCardDisplayRequest';
import { SmoneyCardDisplayResponse } from '../models/card/cardDisplay/SmoneyCardDisplayResponse';
import { SmoneyCardPinResponse } from '../models/card/cardPin/SmoneyCardPinResponse';
import { SmoneyCardHmacRequest } from '../models/card/cardHmac/SmoneyCardHmacRequest';
import { SmoneyCardPinRequest } from '../models/card/cardPin/SmoneyCardPinRequest';
import { SmoneyCardHmacResponse } from '../models/card/cardHmac/SmoneyCardHmacResponse';

export class SmoneyCardApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async updateCard(request: SmoneyUpdateCardRequest): Promise<SmoneyUpdateCardResponse> {
    const { smoneyId, cardId, ...body } = request;

    const { data } = await this._http
      .put<SmoneyUpdateCardResponse>(`users/${smoneyId}/cards/${cardId}`, body)
      .execute();
    return data;
  }

  async createCard(request: SmoneyCreateCardRequest): Promise<SmoneyCreateCardResponse> {
    const { smoneyId, ...body } = request;
    const { data } = await this._http
      .post<SmoneyCreateCardResponse>(`users/${smoneyId}/cards`, body)
      .execute();
    return data;
  }

  async displayPin(request: SmoneyCardPinRequest): Promise<SmoneyCardPinResponse> {
    const { uid, cid, channelCode, rsaPublicKey } = request;
    const { data } = await this._http
      .get<SmoneyCardPinResponse>(
        `users/${uid}/cards/${cid}/PINDisplay?ChannelCode=${channelCode}&PublicKey=${rsaPublicKey}`,
      )
      .execute();
    return data;
  }

  async hmac(request: SmoneyCardHmacRequest): Promise<SmoneyCardHmacResponse> {
    const { cid, RSAPublicKey, HmacData } = request;
    const { data } = await this._http
      .post<SmoneyCardHmacResponse>(`cards/${cid}/hmac`, {
        RSAPublicKey,
        HmacData,
      })
      .execute();
    return data;
  }

  async displayDetails(request: SmoneyCardDisplayRequest): Promise<SmoneyCardDisplayResponse> {
    const { cid, RSAPublicKey } = request;
    const { data } = await this._http
      .post<SmoneyCardDisplayResponse>(`cards/${cid}/display`, {
        RSAPublicKey,
      })
      .execute();
    return data;
  }
}

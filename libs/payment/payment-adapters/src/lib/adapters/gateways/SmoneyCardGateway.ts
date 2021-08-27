import {
  NetworkProvider,
  EncryptedCardPin,
  EncryptedCardDetails,
  EncryptedCardHmac,
  CardGateway,
} from '@oney/payment-core';
import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { SmoneyApi } from '../partners/smoney/SmoneyNetworkProvider';
import { SmoneyCardPinResponse } from '../partners/smoney/models/card/cardPin/SmoneyCardPinResponse';
import { SmoneyCardHmacResponse } from '../partners/smoney/models/card/cardHmac/SmoneyCardHmacResponse';
import { SmoneyCardDisplayResponse } from '../partners/smoney/models/card/cardDisplay/SmoneyCardDisplayResponse';

@injectable()
export class SmoneyCardGateway implements CardGateway {
  constructor(
    private readonly _networkProvider: NetworkProvider<SmoneyApi>,
    private readonly _channelCode: string,
    private readonly _smoneyCardDisplayPinMapper: Mapper<EncryptedCardPin, SmoneyCardPinResponse>,
    private readonly _smoneyCardHmacMapper: Mapper<EncryptedCardHmac, SmoneyCardHmacResponse>,
    private readonly _smoneyCardDisplayDetailsMapper: Mapper<EncryptedCardDetails, SmoneyCardDisplayResponse>,
  ) {}

  async displayPin(uid: string, cid: string, rsaPublicKey: string): Promise<EncryptedCardPin> {
    const displayPinResponse = await this._networkProvider
      .api()
      .smoneyCardApi.displayPin({ uid, cid, channelCode: this._channelCode, rsaPublicKey });

    return this._smoneyCardDisplayPinMapper.toDomain(displayPinResponse);
  }

  async hmac(cid: string, rsaPublicKey: string, hmacData: string): Promise<EncryptedCardHmac> {
    const hmacResponse = await this._networkProvider
      .api()
      .smoneyCardApi.hmac({ cid, RSAPublicKey: rsaPublicKey, HmacData: hmacData });

    return this._smoneyCardHmacMapper.toDomain(hmacResponse);
  }

  async displayDetails(cid: string, rsaPublicKey: string): Promise<EncryptedCardDetails> {
    const displayDetailsResponse = await this._networkProvider
      .api()
      .smoneyCardApi.displayDetails({ cid, RSAPublicKey: rsaPublicKey });

    return this._smoneyCardDisplayDetailsMapper.toDomain(displayDetailsResponse);
  }
}

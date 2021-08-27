import { EncryptedCardHmac } from '@oney/payment-core';
import { Mapper } from '@oney/common-core';
import { SmoneyCardHmacResponse } from '../partners/smoney/models/card/cardHmac/SmoneyCardHmacResponse';

export class SmoneyCardHmacMapper implements Mapper<EncryptedCardHmac, SmoneyCardHmacResponse> {
  toDomain(response: SmoneyCardHmacResponse): EncryptedCardHmac {
    return {
      encryptedData: response.buffer.encryptedData,
      isSuccess: response.IsSuccess,
    };
  }
}

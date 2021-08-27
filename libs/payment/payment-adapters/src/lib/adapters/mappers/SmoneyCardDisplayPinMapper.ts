import { EncryptedCardPin } from '@oney/payment-core';
import { Mapper } from '@oney/common-core';
import { SmoneyCardPinResponse } from '../partners/smoney/models/card/cardPin/SmoneyCardPinResponse';

export class SmoneyCardDisplayPinMapper implements Mapper<EncryptedCardPin, SmoneyCardPinResponse> {
  toDomain(response: SmoneyCardPinResponse): EncryptedCardPin {
    return {
      pinBlock: response.pinBlock,
      ktaKey: response.ktaKey,
      ktkKey: response.ktkKey,
    };
  }
}

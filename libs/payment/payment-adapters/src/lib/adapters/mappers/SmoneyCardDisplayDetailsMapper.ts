import { EncryptedCardDetails } from '@oney/payment-core';
import { Mapper } from '@oney/common-core';
import { SmoneyCardDisplayResponse } from '../partners/smoney/models/card/cardDisplay/SmoneyCardDisplayResponse';

export class SmoneyCardDisplayDetailsMapper
  implements Mapper<EncryptedCardDetails, SmoneyCardDisplayResponse> {
  toDomain(response: SmoneyCardDisplayResponse): EncryptedCardDetails {
    return {
      encryptedData: response.buffer.encryptedData,
      isSuccess: response.IsSuccess,
    };
  }
}

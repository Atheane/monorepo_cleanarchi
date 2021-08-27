import { WriteService } from '@oney/common-core';
import { PaymentIdentifier, RawCallbackPayload, CallbackPayloadRepository } from '@oney/payment-core';
import { inject, injectable } from 'inversify';

@injectable()
export class OdbCallbackPayloadRepository implements CallbackPayloadRepository {
  constructor(@inject(PaymentIdentifier.writeService) private readonly _writeService: WriteService) {}

  async save(callbackPayload: RawCallbackPayload): Promise<RawCallbackPayload> {
    await this._writeService.insert(callbackPayload.props);
    return callbackPayload;
  }
}

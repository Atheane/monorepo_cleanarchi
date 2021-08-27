import { RawCallbackPayload } from '../../entities/RawCallbackPayload';

export interface CallbackPayloadRepository {
  save(callbackPayload: RawCallbackPayload): Promise<RawCallbackPayload>;
}

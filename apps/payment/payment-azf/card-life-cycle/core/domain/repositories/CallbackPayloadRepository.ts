import { CallbackPayload } from '../../adapters/types/CallbackPayload';
import { CallbackRequestPayload } from '../../adapters/types/CallbackRequestPayload';

export interface CallbackPayloadRepository {
  save(callbackRequestPayload: CallbackRequestPayload): Promise<CallbackPayload>;
}

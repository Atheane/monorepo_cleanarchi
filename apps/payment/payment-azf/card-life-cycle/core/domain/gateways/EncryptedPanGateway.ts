import { CallbackPayload } from '../../adapters/types/CallbackPayload';

export interface EncryptedPanGateway {
  getEncryptedPan(callbackPayload: CallbackPayload): Promise<string>;
}

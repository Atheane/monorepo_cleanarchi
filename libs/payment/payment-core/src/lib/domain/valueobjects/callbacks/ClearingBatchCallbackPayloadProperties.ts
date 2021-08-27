import { CallbackType } from '../../types/CallbackType';

export interface ClearingBatchCallbackPayloadProperties {
  id: string;
  reference: string;
  type: CallbackType;
}

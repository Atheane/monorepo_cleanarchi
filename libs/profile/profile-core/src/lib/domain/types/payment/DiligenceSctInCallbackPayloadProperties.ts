import { CallbackType } from './CallbackType';
import { DiligenceStatus } from './DiligenceStatus';
import { DiligencesType } from './DiligencesType';

export interface DiligenceSctInCallbackPayloadProperties {
  type: CallbackType;
  status: DiligenceStatus;
  appUserId: string;
  diligenceType: DiligencesType;
  amount: number;
  transferDate: Date;
  transmitterFullname: string;
}

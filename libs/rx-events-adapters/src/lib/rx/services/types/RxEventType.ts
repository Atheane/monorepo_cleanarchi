import { RxMessageBody, RxMessageBodyMetadata } from './RxMessageBody';

export type RxEventType = {
  id: string;
  props: RxMessageBody;
  metadata: RxMessageBodyMetadata;
  timestamp: number;
  sentAt: Date;
};

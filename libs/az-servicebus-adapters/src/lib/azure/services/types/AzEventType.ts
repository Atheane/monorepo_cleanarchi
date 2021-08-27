import { AzMessageBody, AzMessageBodyMetadata } from './AzMessageBody';

export type AzEventType = {
  id: string;
  props: AzMessageBody;
  metadata: AzMessageBodyMetadata;
  timestamp: number;
  sentAt: Date;
};

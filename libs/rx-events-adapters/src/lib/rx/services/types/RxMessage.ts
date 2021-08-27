import { EventMetadata } from '@oney/messages-core';

export type RxMessage = {
  body: string | Buffer;
  metadata: EventMetadata;
  label: string;
  messageId: string;
};

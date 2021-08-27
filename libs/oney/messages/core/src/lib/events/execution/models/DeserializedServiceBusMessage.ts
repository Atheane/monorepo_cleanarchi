import { ReceivedMessageInfo } from '@azure/service-bus';
import { EventMessageBody } from '@oney/messages-core';
import { Merge } from 'ts-essentials';

export type DeserializedServiceBusMessage = Merge<
  ReceivedMessageInfo,
  {
    body: EventMessageBody;
  }
>;

import { Topic } from '@oney/core';
import { EventMessageBodyMapper } from '../EventMessageBodyMapper';
import { EventMessageBodySerializer } from '../EventMessageBodySerializer';

export interface EventHandlerRegistrationOptions {
  topic?: Topic;
  subscription?: string;
  customMapper?: EventMessageBodyMapper;
  customSerializer?: EventMessageBodySerializer;
}

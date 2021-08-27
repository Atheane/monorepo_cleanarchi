import { Queue } from '@oney/core';
import { CommandMessageBodyMapper } from '../CommandMessageBodyMapper';
import { CommandMessageBodySerializer } from '../CommandMessageBodySerializer';

export interface CommandHandlerRegistrationOptions {
  queue?: Queue;
  subscription?: string;
  customMapper?: CommandMessageBodyMapper;
  customSerializer?: CommandMessageBodySerializer;
}

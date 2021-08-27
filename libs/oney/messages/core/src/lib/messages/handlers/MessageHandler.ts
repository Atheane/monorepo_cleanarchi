import { AsyncOrSync } from 'ts-essentials';
import { Message } from '../Message';
import { MessageReceiveContext } from '../MessageReceiveContext';

export interface MessageHandler<TMessage extends Message = Message> {
  handle: (message: TMessage, ctx: MessageReceiveContext) => AsyncOrSync<void>;
}

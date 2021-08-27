import { Disposable } from '@oney/core';
import { injectable } from 'inversify';
import { Message } from './Message';
import { MessageBodyMapper } from './MessageBodyMapper';
import { MessageBodySerializer } from './MessageBodySerializer';
import { MessageCtor } from './MessageCtor';
import { MessageHandler } from './handlers/MessageHandler';

export interface MessageReceiverOptions {
  customMapper?: MessageBodyMapper;
  customSerializer?: MessageBodySerializer;
}

@injectable()
export abstract class MessageReceiver {
  abstract subscribe<TMessage extends Message>(
    message: MessageCtor<TMessage>,
    handler: MessageHandler<TMessage>,
    options?: MessageReceiverOptions,
  ): Disposable;
}

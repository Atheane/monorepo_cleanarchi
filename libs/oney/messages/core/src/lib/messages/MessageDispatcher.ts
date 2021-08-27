import { injectable } from 'inversify';
import { Message } from './Message';
import { MessageBodyMapper } from './MessageBodyMapper';
import { MessageBodySerializer } from './MessageBodySerializer';
import { Dispatcher } from '../common/Dispatcher';

export interface MessageDispatcherOptions {
  customMapper?: MessageBodyMapper;
  customSerializer?: MessageBodySerializer;
}

@injectable()
export abstract class MessageDispatcher<TMessage extends Message = Message> extends Dispatcher<
  TMessage,
  MessageDispatcherOptions
> {}

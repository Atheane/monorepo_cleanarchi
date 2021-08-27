import { Message } from './Message';
import { MessageBody } from './MessageBody';

export abstract class MessageBodySerializer {
  abstract serialize(messageBody: MessageBody): string;
  abstract deserialize<TMessage extends Message = Message>(event: string): MessageBody<TMessage>;
}

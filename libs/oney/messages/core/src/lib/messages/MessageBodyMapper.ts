import { OneyExecutionContext } from '@oney/context';
import { Message } from '@oney/messages-core';
import { MessageBody } from './MessageBody';

export abstract class MessageBodyMapper {
  abstract toMessage<TMessage extends Message = Message>(messageBody: MessageBody<TMessage>): TMessage;
  abstract toMessageBody<TMessage extends Message = Message>(
    command: TMessage,
    context?: OneyExecutionContext,
  ): MessageBody<TMessage>;
}

import { Newable } from 'ts-essentials';
import { MessageHandler } from './MessageHandler';
import { Message } from '../Message';

export type MessageHandlerCtor<TMessage extends Message> = Newable<MessageHandler<TMessage>>;

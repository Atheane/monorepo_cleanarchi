import { Newable } from 'ts-essentials';
import { Message } from './Message';

export type MessageCtor<TMessage extends Message> = Newable<TMessage>;

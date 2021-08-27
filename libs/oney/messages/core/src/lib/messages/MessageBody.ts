import { OneyExecutionContext } from '@oney/context';
import { Message } from './Message';

export interface MessageBody<TMessage extends Message = Message> {
  id: string;
  name: string;
  namespace: string;
  version: number;
  timestamp: number;
  context: OneyExecutionContext;
  payload: TMessage;
}

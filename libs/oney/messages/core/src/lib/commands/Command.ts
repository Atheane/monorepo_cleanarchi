import { Message } from '../messages/Message';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Command<T = any> extends Message<T> {}

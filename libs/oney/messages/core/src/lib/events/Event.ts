import { Message } from '../messages/Message';

// todo, currently we force the object type because EventDispatcher and EventReceiver doesn't support Primitives
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Event<T extends object = object> extends Message<T> {}

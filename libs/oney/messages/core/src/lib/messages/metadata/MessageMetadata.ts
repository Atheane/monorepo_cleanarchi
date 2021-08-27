import 'reflect-metadata';
import { Message } from '../Message';
import { MessageCtor } from '../MessageCtor';

const MESSAGE_METADATA_SYMBOL = Symbol.for('MESSAGE_METADATA_SYMBOL');

export class MessageMetadata<TMessage extends Message = Message> {
  public static ensure<TMessage extends Message>(target: MessageCtor<TMessage>): MessageMetadata<TMessage> {
    if (!Reflect.hasOwnMetadata(MESSAGE_METADATA_SYMBOL, target)) {
      const schemaMetadata = new MessageMetadata(target);

      Reflect.defineMetadata(MESSAGE_METADATA_SYMBOL, schemaMetadata, target);
    }

    return Reflect.getOwnMetadata(MESSAGE_METADATA_SYMBOL, target);
  }

  public static getFromCtor<TMessage extends Message>(
    target: MessageCtor<TMessage>,
  ): MessageMetadata<TMessage> {
    return Reflect.getOwnMetadata(MESSAGE_METADATA_SYMBOL, target);
  }

  public static getFromInstance<TMessage extends Message>(target: TMessage): MessageMetadata<TMessage> {
    return Reflect.getOwnMetadata(MESSAGE_METADATA_SYMBOL, target.constructor);
  }

  constructor(target: MessageCtor<TMessage>) {
    this.target = target;
  }

  public target: MessageCtor<TMessage>;
  public name: string;
  public namespace: string;
  public version: number;
}

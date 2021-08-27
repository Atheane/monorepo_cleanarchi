import { EventMessageBody } from './EventMessageBody';

export abstract class EventMessageBodySerializer {
  abstract serialize(messageBody: EventMessageBody): string | Buffer;
  abstract deserialize(messageBody: string | Buffer): EventMessageBody;
}

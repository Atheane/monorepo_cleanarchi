import { JSONConvert } from '@oney/common-core';
import { EventMessageBody, EventMessageBodySerializer } from '@oney/messages-core';

export class DefaultEventMessageBodySerializer extends EventMessageBodySerializer {
  public deserialize(messageBody: string | Buffer): EventMessageBody {
    if (messageBody instanceof Buffer) {
      throw new Error(`${DefaultEventMessageBodySerializer.name} doesn't support Buffer messageBody`);
    }

    return JSONConvert.deserialize(messageBody);
  }

  public serialize(messageBody: EventMessageBody): string {
    return JSONConvert.serialize(messageBody);
  }
}

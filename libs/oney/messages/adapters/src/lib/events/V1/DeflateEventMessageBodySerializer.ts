import { JSONConvert } from '@oney/common-core';
import { EventMessageBody, EventMessageBodySerializer } from '@oney/messages-core';
import * as zlib from 'zlib';

export class DeflateEventMessageBodySerializer extends EventMessageBodySerializer {
  public deserialize(messageBody: string | Buffer): EventMessageBody {
    if (typeof messageBody === 'string') {
      throw new Error(`${DeflateEventMessageBodySerializer.name} doesn't support string messageBody`);
    }

    const decompressed = zlib.inflateSync(messageBody);

    const utf8String = decompressed.toString('utf8');

    return JSONConvert.deserialize(utf8String);
  }

  public serialize(messageBody: EventMessageBody): Buffer {
    const stringify = JSONConvert.serialize(messageBody);

    const utf8Buffer = new Buffer(stringify, 'utf8');

    const compressed = zlib.deflateSync(utf8Buffer);

    return compressed;
  }
}

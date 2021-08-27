import { JSONConvert } from '@oney/common-core';
import { EventMessageBody, EventMessageBodySerializer } from '@oney/messages-core';
import * as zlib from 'zlib';

export class ZipEventMessageBodySerializer extends EventMessageBodySerializer {
  public deserialize(messageBody: Buffer): EventMessageBody {
    if (typeof messageBody === 'string') {
      throw new Error(`${ZipEventMessageBodySerializer.name} doesn't support string messageBody`);
    }

    const decompressed = zlib.gunzipSync(messageBody);

    const utf8String = decompressed.toString('utf8');

    return JSONConvert.deserialize(utf8String);
  }

  public serialize(messageBody: EventMessageBody): Buffer {
    const stringify = JSONConvert.serialize(messageBody);

    const utf8Buffer = new Buffer(stringify, 'utf8');

    const compressed = zlib.gzipSync(utf8Buffer);

    return compressed;
  }
}

import { Log, LogTransformer } from '@oney/logger-core';

export class ToUppercaseTransformer extends LogTransformer {
  public transforms(log: Log): Log {
    const copy = log.clone();

    copy.message = copy.message.toLocaleUpperCase();

    return copy;
  }
}

export function toUppercaseTransformerFactory() {
  return new ToUppercaseTransformer();
}

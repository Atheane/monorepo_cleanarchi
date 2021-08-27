import 'reflect-metadata';
import { Log, LogTransformer } from '@oney/logger-core';
import { FlagFromLogMeta, FlagFromLogMetaSymbol } from './decorators/FlagFromLogMeta';

export class DecoratedLogTransformer extends LogTransformer {
  public transforms(log: Log): Log {
    const clone = log.clone();

    // /!\ Side effect: it updates its parameter
    this.processFromLogMetadata(clone.meta);

    return clone;
  }

  private processFromLogMetadata(meta?: any) {
    if (meta == null) return meta;

    const process = model => {
      if (this.IsObject(model)) {
        const metadata: FlagFromLogMeta = Reflect.getMetadata(FlagFromLogMetaSymbol, model);

        Object.keys(model).forEach(key => {
          if (metadata && metadata[key]) {
            if (metadata[key] === 'omit') {
              delete model[key];
            } else if (metadata[key] === 'obfuscate') {
              model[key] = `[${key}]`;
            }
          }

          if (this.IsObject(model[key])) {
            model[key] = process(model[key]);
          }
        });

        return model;
      }
    };

    return process(meta);
  }

  private IsObject(x: any) {
    return typeof x === 'object' ? x !== null : typeof x === 'function';
  }
}

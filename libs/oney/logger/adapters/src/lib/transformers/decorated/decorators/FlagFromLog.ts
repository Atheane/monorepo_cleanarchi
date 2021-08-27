import { FlagFromLogMeta, FlagFromLogMetaSymbol } from './FlagFromLogMeta';

export function FlagFromLog(flag: string, override: boolean): any {
  return (target: any, key: string) => {
    let meta: FlagFromLogMeta = Reflect.getMetadata(FlagFromLogMetaSymbol, target);

    meta = {
      ...meta,
    };

    // override or not already defined
    if (override || meta[key] == null) {
      meta[key] = flag;
    }

    Reflect.defineMetadata(FlagFromLogMetaSymbol, meta, target);
  };
}

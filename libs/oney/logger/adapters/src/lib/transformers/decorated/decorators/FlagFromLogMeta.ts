export const FlagFromLogMetaSymbol = Symbol.for('FlagFromLogMeta');

export interface FlagFromLogMeta {
  [key: string]: string;
}

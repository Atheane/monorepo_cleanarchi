import { FlagFromLog } from './FlagFromLog';

export function Obfuscate(): PropertyDecorator {
  return FlagFromLog('obfuscate', false);
}

import { FlagFromLog } from './FlagFromLog';

export function Omit(): PropertyDecorator {
  return FlagFromLog('omit', true);
}

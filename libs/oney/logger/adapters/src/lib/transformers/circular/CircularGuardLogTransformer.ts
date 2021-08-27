import { Log, LogTransformer } from '@oney/logger-core';
import { CycleHelper } from './CycleHelper';

export class CircularGuardLogTransformer extends LogTransformer {
  public transforms(log: Log): Log {
    const clone = log.clone();

    clone.meta = CycleHelper.decycle(clone.meta);

    return clone;
  }
}

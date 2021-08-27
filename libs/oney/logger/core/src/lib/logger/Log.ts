import * as _ from 'lodash';
import { LogLevel } from './LogLevel';

export class Log {
  public level: LogLevel;
  public message: string;
  public meta?: any;

  constructor(level: LogLevel, message: string, meta?: any) {
    this.level = level;
    this.message = message;
    this.meta = meta;
  }

  clone(): Log {
    const meta = _.cloneDeep(this.meta);
    return new Log(this.level, this.message, meta);
  }
}

import { Log } from '../logger/Log';

export abstract class LogTransformer {
  abstract transforms(log: Log): Log;
}

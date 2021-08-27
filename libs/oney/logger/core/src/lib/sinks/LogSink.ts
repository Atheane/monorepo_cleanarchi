import { Log } from '../logger/Log';

export abstract class LogSink {
  abstract collectTransformedLog(log: Log): void;

  abstract collectRawLog(log: Log): void;
}

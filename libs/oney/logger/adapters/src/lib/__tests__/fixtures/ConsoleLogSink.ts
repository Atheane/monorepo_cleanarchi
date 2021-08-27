import { Log, LogSink } from '@oney/logger-core';

export class ConsoleLogSink extends LogSink {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onRawLog: (log: Log) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTransformedLog: (log: Log) => void = () => {};

  public collectRawLog(log: Log): void {
    console.log('raw', JSON.stringify(log));
    this.onRawLog(log);
  }

  public collectTransformedLog(log: Log): void {
    console.log('transformed', JSON.stringify(log));
    this.onTransformedLog(log);
  }
}

export function consoleLogSinkFactory() {
  return new ConsoleLogSink();
}

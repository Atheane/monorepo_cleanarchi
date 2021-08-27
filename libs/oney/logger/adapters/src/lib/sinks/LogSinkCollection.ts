import { Log, LogSink } from '@oney/logger-core';
import { Bad, Ok } from '@oney/result';

export class LogSinkCollection extends LogSink {
  private readonly _sinks: LogSink[];

  constructor() {
    super();
    this._sinks = [];
  }

  get sinks() {
    return this._sinks;
  }

  register(sink: LogSink) {
    if (this._sinks.indexOf(sink) > -1) {
      return Bad('SINK_ALREADY_REGISTERED');
    }

    this._sinks.push(sink);

    return Ok();
  }

  unregister(sink: LogSink) {
    const index = this._sinks.indexOf(sink);

    if (index === -1) {
      return Bad('SINK_NOT_FOUND');
    }

    this._sinks.splice(index, 1);

    return Ok();
  }

  public collectRawLog(log: Log): void {
    this._sinks.forEach(x => {
      x.collectRawLog(log);
    });
  }

  public collectTransformedLog(log: Log): void {
    this._sinks.forEach(x => {
      x.collectTransformedLog(log);
    });
  }
}

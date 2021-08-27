import {
  Log,
  LoggerWithSinks,
  LoggerWithTransformers,
  LogLevel,
  LogSink,
  LogTransformer,
  Logger,
  LoggerWithMakeableChild,
} from '@oney/logger-core';
import { LogSinkCollection } from '../sinks/LogSinkCollection';
import { LogTransformerCollection } from '../transformers/LogTransformerCollection';

export class LogBroker
  implements Logger, LoggerWithSinks, LoggerWithTransformers, LoggerWithMakeableChild<LogBroker> {
  private readonly _transformers: LogTransformerCollection;
  private readonly _sinks: LogSinkCollection;

  constructor() {
    this._transformers = new LogTransformerCollection();
    this._sinks = new LogSinkCollection();
  }

  public trace(message: string, meta?: any): void {
    this.log(LogLevel.TRACE, message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  public info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  public warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  public error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  public fatal(message: string, meta?: any): void {
    this.log(LogLevel.FATAL, message, meta);
  }

  public log(level: LogLevel, message: string, meta?: any) {
    const log: Log = new Log(level, message, meta);

    // todo make readonly
    this._sinks.collectRawLog(log);

    const transformedLog = this._transformers.transforms(log);

    // todo make readonly
    this._sinks.collectTransformedLog(transformedLog);
  }

  public registerTransformer(transformer: LogTransformer) {
    return this._transformers.register(transformer);
  }

  public unregisterTransformer(transformer: LogTransformer) {
    return this._transformers.unregister(transformer);
  }

  public registerSink(sink: LogSink) {
    return this._sinks.register(sink);
  }

  public unregisterSink(sink: LogSink) {
    return this._sinks.unregister(sink);
  }

  public createChild(): LogBroker {
    const child = new LogBroker();

    // register parent sinks
    // take care, it use the sink collection
    // if a sink is register or unregister from parent
    // it will be unregister from child
    child.registerSink(this._sinks);

    // register parent transformers
    // take care, it use the transformer collection
    // if a transformer is register or unregister from parent
    // it will be unregister from child
    child.registerTransformer(this._transformers);

    return child;
  }
}

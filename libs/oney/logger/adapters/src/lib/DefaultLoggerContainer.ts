import { LogLevel, LogSink, LogTransformer } from '@oney/logger-core';
import { LogBroker } from './logger/LogBroker';

export class DefaultLoggerContainer extends LogBroker {
  private _defaultLogger: LogBroker;

  constructor() {
    super();
    this._defaultLogger = new LogBroker();
  }

  public log(level: LogLevel, message: string, meta?: any) {
    this._defaultLogger.log(level, message, meta);
  }

  public setDefaultLogger(logger: LogBroker) {
    if (logger instanceof DefaultLoggerContainer) {
      throw new Error('DefaultLoggerContainer cannot be registered in self');
    }

    this._defaultLogger.info('@oney/logger.default-logger.unset', {
      before: this._defaultLogger.constructor.name,
      after: logger.constructor.name,
    });

    this._defaultLogger = logger;

    this._defaultLogger.info('@oney/logger.default-logger.set', {
      before: this._defaultLogger.constructor.name,
      after: logger.constructor.name,
    });
  }

  public registerTransformer(transformer: LogTransformer) {
    return this._defaultLogger.registerTransformer(transformer);
  }

  public unregisterTransformer(transformer: LogTransformer) {
    return this._defaultLogger.unregisterTransformer(transformer);
  }

  public registerSink(sink: LogSink) {
    return this._defaultLogger.registerSink(sink);
  }

  public unregisterSink(sink: LogSink) {
    return this._defaultLogger.unregisterSink(sink);
  }
}

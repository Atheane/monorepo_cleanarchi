import { LogSink, LogTransformer } from '@oney/logger-core';
import { defaultLogger } from './default';
import { LogBroker } from './logger/LogBroker';

export class DefaultLoggerBuilder {
  private _logBroker: LogBroker;
  private _transformers: LogTransformer[];
  private _sinks: LogSink[];

  constructor() {
    this._logBroker = new LogBroker();
    this._transformers = [];
    this._sinks = [];
  }

  useCustomLogBroker(logBroker: LogBroker) {
    this._logBroker = logBroker;
    return this;
  }

  useLogTransformer(transformer: LogTransformer) {
    this._transformers.push(transformer);
    return this;
  }

  useTransformer(transformer: LogTransformer) {
    this._transformers.push(transformer);
    return this;
  }

  useSink(sink: LogSink) {
    this._sinks.push(sink);
    return this;
  }

  activate() {
    const child = this._logBroker.createChild();

    // register transformers
    for (const transformer of this._transformers) {
      child.registerTransformer(transformer);
    }

    // register sinks
    for (const sink of this._sinks) {
      child.registerSink(sink);
    }

    // set the default logger
    defaultLogger.setDefaultLogger(child);

    this.logsSetupInformations();
  }

  private logsSetupInformations() {
    defaultLogger.info(`LogBroker: ${this._logBroker.constructor.name} used`);

    // log transformers
    for (const transformer of this._transformers) {
      defaultLogger.info(`Transformer: ${transformer.constructor.name} registered`);
    }

    // log sinks
    for (const sink of this._sinks) {
      defaultLogger.info(`Sink: ${sink.constructor.name} registered`);
    }
  }
}

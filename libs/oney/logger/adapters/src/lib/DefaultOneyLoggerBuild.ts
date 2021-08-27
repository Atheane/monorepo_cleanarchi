import { Logger as WinstonLogger, LoggerOptions } from 'winston';
import { Logger as TsLogger, ISettingsParam } from 'tslog';
import { defaultLogger } from './default';
import { DefaultLoggerBuilder } from './DefaultLoggerBuilder';
import { DefaultLoggerContainer } from './DefaultLoggerContainer';
import { TsLogSink } from './sinks/tslog/TsLogSink';
import { WinstonLoggerSink } from './sinks/winston/WinstonLoggerSink';
import { CircularGuardLogTransformer } from './transformers/circular/CircularGuardLogTransformer';
import { DecoratedLogTransformer } from './transformers/decorated/DecoratedLogTransformer';

export class DefaultOneyLoggerBuild {
  private _build: DefaultLoggerBuilder;

  constructor() {
    this._build = new DefaultLoggerBuilder();
  }

  // todo enable a custom configuration from this builder
  // currently use DefaultLoggerBuilder directly

  initializeDefaultTransformers(): this {
    this._build.useLogTransformer(new CircularGuardLogTransformer());
    this._build.useLogTransformer(new DecoratedLogTransformer());

    return this;
  }

  initializeDefaultSinks(): this {
    return this;
  }

  useWinston(logger?: WinstonLogger): DefaultLoggerContainer;
  useWinston(options?: LoggerOptions): DefaultLoggerContainer;
  useWinston(optionsOrLogger?: LoggerOptions | WinstonLogger): DefaultLoggerContainer {
    this._build.useSink(new WinstonLoggerSink(optionsOrLogger));

    // activate this logger definition as the default logger
    this._build.activate();

    return defaultLogger;
  }

  useTsLog(logger?: TsLogger): DefaultLoggerContainer;
  useTsLog(settings?: ISettingsParam): DefaultLoggerContainer;
  useTsLog(settingOrLogger?: ISettingsParam | TsLogger): DefaultLoggerContainer {
    // stupid thing to avoid a type checking error
    if (settingOrLogger instanceof TsLogger) {
      this._build.useSink(new TsLogSink(settingOrLogger));
    } else {
      this._build.useSink(new TsLogSink(settingOrLogger));
    }

    // activate this logger definition as the default logger
    this._build.activate();

    return defaultLogger;
  }
}

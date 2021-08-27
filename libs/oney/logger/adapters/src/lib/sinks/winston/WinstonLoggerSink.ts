import { Log, LogLevel, LogSink } from '@oney/logger-core';
import { createLogger, format, Logger, LoggerOptions, transports } from 'winston';

export class WinstonLoggerSink extends LogSink {
  // used to be able to compare instance
  // because winston doesn't export logger class
  static emptyLogger = createLogger({});
  static isInstanceOfLogger(input: any): input is Logger {
    // todo maybe we have a better method
    // return 'levels' in input && 'log' in input;
    return input && Object.keys(WinstonLoggerSink.emptyLogger).every(key => key in input);
  }

  static usedLevels = {
    fatal: 10,
    error: 20,
    warn: 30,
    info: 40,
    debug: 50,
    trace: 60,
  };

  private _logger: Logger;

  constructor();
  constructor(logger?: Logger);
  constructor(options?: LoggerOptions);
  constructor(optionsOrLogger?: LoggerOptions | Logger) {
    super();

    if (WinstonLoggerSink.isInstanceOfLogger(optionsOrLogger)) {
      // todo avoid the user defined level override
      optionsOrLogger.levels = WinstonLoggerSink.usedLevels;

      this._logger = optionsOrLogger;
    } else {
      this._logger = createLogger(
        optionsOrLogger || {
          format: format.combine(
            format.align(),
            format.timestamp(),
            format.prettyPrint({
              colorize: true,
              depth: 2,
            }),
            format.json(),
          ),
          levels: WinstonLoggerSink.usedLevels,
          transports: [
            new transports.Console({
              level: 'debug',
              handleExceptions: true,
            }),
          ],
          exitOnError: false,
        },
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public collectRawLog(log: Log): void {
    // do nothing
  }

  public collectTransformedLog(log: Log): void {
    const { level, message, meta } = log;

    if (level === LogLevel.FATAL) {
      this._logger.log({
        level: 'fatal',
        message: message,
        meta,
      });
    }

    if (level === LogLevel.ERROR) {
      this._logger.log({
        level: 'error',
        message: message,
        meta,
      });
    }

    if (level === LogLevel.WARN) {
      this._logger.log({
        level: 'warn',
        message: message,
        meta,
      });
    }

    if (level === LogLevel.INFO) {
      this._logger.log({
        level: 'info',
        message: message,
        meta,
      });
    }

    if (level === LogLevel.DEBUG) {
      this._logger.log({
        level: 'debug',
        message: message,
        meta,
      });
    }

    if (level === LogLevel.TRACE) {
      this._logger.log({
        level: 'trace',
        message: message,
        meta,
      });
    }
  }
}

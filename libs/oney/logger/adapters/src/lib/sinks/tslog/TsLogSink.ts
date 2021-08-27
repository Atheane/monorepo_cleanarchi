import { Log, LogLevel, LogSink } from '@oney/logger-core';
import { Logger, ISettingsParam } from 'tslog';

const defaultSettings: ISettingsParam = {
  ignoreStackLevels: 7,
};

export class TsLogSink extends LogSink {
  private _logger: Logger;

  constructor(logger?: Logger);
  constructor(settings?: ISettingsParam);
  constructor(settingOrLogger?: ISettingsParam | Logger) {
    super();

    if (settingOrLogger instanceof Logger) {
      this._logger = settingOrLogger;
    } else {
      const usedSettings = {
        ...defaultSettings,
        ...settingOrLogger,
      };

      this._logger = new Logger(usedSettings);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public collectRawLog(log: Log): void {
    // do nothing
  }

  public collectTransformedLog(log: Log): void {
    if (log.level === LogLevel.TRACE) {
      this._logger.trace(log.message, log.meta);
    }
    if (log.level === LogLevel.DEBUG) {
      this._logger.debug(log.message, log.meta);
    }
    if (log.level === LogLevel.INFO) {
      this._logger.info(log.message, log.meta);
    }
    if (log.level === LogLevel.WARN) {
      this._logger.warn(log.message, log.meta);
    }
    if (log.level === LogLevel.ERROR) {
      this._logger.error(log.message, log.meta);
    }
    if (log.level === LogLevel.FATAL) {
      this._logger.fatal(log.message, log.meta);
    }
  }
}

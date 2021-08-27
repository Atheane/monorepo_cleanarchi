import { Logger } from '@oney/logger-core';

export class AlertDispatcherFromLogger {
  private _logger: Logger;

  constructor(logger: Logger) {
    this._logger = logger;
  }

  public trace(message: string, meta?: any): void {
    this._logger.trace(`[[ALERT]] ${message}`, meta);
  }

  public debug(message: string, meta?: any): void {
    this._logger.debug(`[[ALERT]] ${message}`, meta);
  }

  public info(message: string, meta?: any): void {
    this._logger.info(`[[ALERT]] ${message}`, meta);
  }

  public warn(message: string, meta?: any): void {
    this._logger.warn(`[[ALERT]] ${message}`, meta);
  }

  public error(message: string, meta?: any): void {
    this._logger.error(`[[ALERT]] ${message}`, meta);
  }

  public fatal(message: string, meta?: any): void {
    this._logger.fatal(`[[ALERT]] ${message}`, meta);
  }
}

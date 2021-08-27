import { defaultLogger } from '@oney/logger-adapters';
import { Error } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';
import { ConcurrencyStrategy } from './ConcurrencyStrategy';

export class RetryConcurrencyStrategy extends ConcurrencyStrategy {
  private readonly _shouldRetry: () => AsyncOrSync<boolean>;
  private _retryCount: number;

  constructor(shouldRetry: () => AsyncOrSync<boolean>) {
    super();
    this._retryCount = 0;
    this._shouldRetry = shouldRetry;
  }

  protected async onVersionError<T>(cb: () => AsyncOrSync<T>, error: Error.VersionError): Promise<T> {
    const shouldRetry = this._shouldRetry();
    if (shouldRetry) {
      this._retryCount++;

      defaultLogger.info(`${RetryConcurrencyStrategy.name} retrying: ${this._retryCount}`);

      return await this.execute(cb);
    } else {
      defaultLogger.error(`${RetryConcurrencyStrategy.name} throw after ${this._retryCount} retry`);
      throw error;
    }
  }
}

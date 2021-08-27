import { defaultLogger } from '@oney/logger-adapters';
import { Error } from 'mongoose';
import { AsyncOrSync } from 'ts-essentials';

export abstract class ConcurrencyStrategy {
  protected constructor() {
    defaultLogger.info(`ConcurrencyStrategy: ${this.constructor.name} created`);
  }

  async execute<T>(cb: () => AsyncOrSync<T>): Promise<T> {
    try {
      return await cb();
    } catch (e) {
      if (e instanceof Error.VersionError) {
        defaultLogger.warn(`ConcurrencyStrategy: ${this.constructor.name} apply onVersionError`, e);
        return this.onVersionError(cb, e);
      } else {
        throw e;
      }
    }
  }

  protected abstract onVersionError<T>(cb: () => AsyncOrSync<T>, error: Error.VersionError): AsyncOrSync<T>;
}

import { Result } from '@oney/http';
import { injectable } from 'inversify';
import { ILongPolling } from './ILongPolling';
import { AxiosError } from './types/Axios';
import { LongPollingConfig } from './types/LongPolling';

@injectable()
export class LongPolling implements ILongPolling {
  constructor(private readonly _config: LongPollingConfig) {}

  async polling<T>(request: () => Promise<Result<T>>, successCondition: (result) => boolean): Promise<T> {
    const { interval, maxAttemps } = this._config;
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      let currentAttemp = 0;
      while (currentAttemp < maxAttemps) {
        try {
          const result = await request();
          if (successCondition(result) || this.nextAttempWillExceedMaxAttemp(currentAttemp, maxAttemps)) {
            return resolve(result.data);
          }
          currentAttemp += 1;
          await this.delay(interval);
        } catch (e) {
          const error: AxiosError = e;
          return reject(error.response.data);
        }
      }
    });
  }

  private nextAttempWillExceedMaxAttemp(currentAttemp, attemps) {
    return currentAttemp + 1 === attemps;
  }

  private delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

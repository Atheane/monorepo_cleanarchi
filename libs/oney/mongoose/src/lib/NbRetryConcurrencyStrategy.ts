import { defaultLogger } from '@oney/logger-adapters';
import { RetryConcurrencyStrategy } from './RetryConcurrencyStrategy';

export class NbRetryConcurrencyStrategy extends RetryConcurrencyStrategy {
  private readonly _nbRetry: number;
  private _nbRetryExecuted: number;

  constructor(nbRetry: number) {
    super(() => this.shouldRetry());
    this._nbRetry = nbRetry;
    this._nbRetryExecuted = 0;
  }

  shouldRetry(): boolean {
    this._nbRetryExecuted++;
    const shouldRetry = this._nbRetryExecuted <= this._nbRetry;

    if (!shouldRetry) {
      defaultLogger.error(`${NbRetryConcurrencyStrategy.name} max retry reached: ${this._nbRetry}`);
    }

    return shouldRetry;
  }
}

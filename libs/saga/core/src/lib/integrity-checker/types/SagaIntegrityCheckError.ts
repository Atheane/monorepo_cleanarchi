import { SagaIntegrityCheckResult } from './SagaIntegrityCheckResult';

export class SagaIntegrityCheckError extends Error {
  constructor(result: SagaIntegrityCheckResult) {
    super(`The saga integrity checking found ${result.errors.length} errors`);
    this.details = result;
  }

  public details: SagaIntegrityCheckResult;
}

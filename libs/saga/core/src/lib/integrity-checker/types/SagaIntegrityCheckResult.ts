import { SagaIntegrityCheckError } from './SagaIntegrityCheckError';
import { SagaIntegrityError } from './SagaIntegrityError';

export class SagaIntegrityCheckResult {
  private _errors: SagaIntegrityError[];

  constructor() {
    this._errors = [];
  }

  addErrors(...errors: SagaIntegrityError[]) {
    this._errors.push(...errors);
  }

  get onError() {
    return this._errors.length > 0;
  }

  get onSuccess() {
    return !this.onError;
  }

  // to make this readonly
  get errors() {
    return this._errors;
  }

  throwDetailedError() {
    throw new SagaIntegrityCheckError(this);
  }
}

import { SagaIntegrityCheckResult } from './types/SagaIntegrityCheckResult';

export abstract class SagaIntegrityChecker {
  abstract check(): SagaIntegrityCheckResult;
}

import { DomainError } from './DomainError';

export class AlgoanTransactionsNotFound extends DomainError {
  constructor(cause?: any) {
    super('ALGOAN_TRANSACTIONS_NOT_FOUND', cause);
  }
}

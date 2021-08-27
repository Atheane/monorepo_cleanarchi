import { DomainError } from './DomainError';

export class AlgoanAccountNotFound extends DomainError {
  constructor(cause?: any) {
    super('ALGOAN_ACCOUNT_NOT_FOUND', cause);
  }
}

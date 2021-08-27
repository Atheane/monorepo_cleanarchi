import { Operation } from '../../aggregates/Operation';

export interface OperationRepositoryWrite {
  save(operation: Operation): Promise<Operation>;
}

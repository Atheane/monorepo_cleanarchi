import { BankConnection } from '../aggregates/BankConnection';

export interface IConnectionRepository {
  getConnectionsOwnedByUserId(userId: string): Promise<BankConnection[]>;
}
